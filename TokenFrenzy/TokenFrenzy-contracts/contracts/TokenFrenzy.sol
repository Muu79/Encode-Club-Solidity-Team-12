//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "./interfaces/IUniswapV2Pair.sol";

/**
 * @title TokenFrenzy is a ERC20 token lottery contract
 * A player can enter the lottery with any ERC20 token (accepted by the lottery)
 * and his odds of winning are calculated at the current price (entering the lottery) in WETH.
 * This introduce a "mindgame" to "hunt" a better token pricing from the pool to increase the probability of winning the lottery.
 * @author Stefan B 
 * @dev This contract implements randomness source from Chainlink VRF2 
 * 
 */
contract TokenFrenzy is VRFV2WrapperConsumerBase, ConfirmedOwner {
    event EnteredLottery(address indexed sender, address indexed token, uint256 indexed amount); 
    event RandomRequest(uint256 indexed requestId, uint256 indexed index);
    event RandomResult(uint256 indexed requestId, uint256 indexed index);
    event Winner(address indexed winner, uint256 indexed index);

    /// @dev used to request `randomWord` from Chainlink VRF2
    struct RequestStatus {
        uint256 fees;
        uint256 randomWord;
        bool fulfilled; 
    }

    /**
     * @dev Instance of a lottery
     *      `ownersFee` owners fee in procent with 2 'decimals'(10000 = 100%) 
     *      `lotteryClosingTime` timestamp after wich the open lottery can be closed
     *      `totalBets` total amount of tokens in WETH received by the open lottery 
     *      `pairs` pairs addresses with WETH of each accepted token (UniswapV2 pair)
     *      `enteredLottery` stores if a player entered the lottery
     *      `acceptedTokens` stores if a token is accepted 
     *      `wethWorth` stores each player`s amount of tokens in WETH deposited 
     *      `amountTokens` stores the amount of tokens deposited
     *      `listAcceptedTokens` list of accepted tokens used to ease access to `acceptedTokens` mapping
     *      `listEnteredLottery` list of players entered lottery used to ease ease access to `wethWorth` mapping
     */
    struct lotteryInstance {
        uint16 ownersFee;
        uint64 lotteryClosingTime;
        address lotteryWinner;
        uint256 totalBets;
        uint256 minBet;
        mapping (address => address) pairs; 
        mapping (address => bool) enteredLottery;
        mapping (address => bool) acceptedTokens;
        mapping (address => uint256) wethWorth;
        mapping (address => uint256) amountTokens;
        address[] listAcceptedTokens;
        address[] listEnteredLottery;
    }

    /// @dev Helper for `withdrawTokens`
    enum callerId { Owner , Winner, Random }

    /// @dev Index of the lottery instance starting at 1
    uint256 public index;
    /// @dev Storing the latest requestId from VRF2
    uint256 latestRequestId;
    /// @dev Helper index for finding winner
    uint256 winnerIndex;
    /// @dev Helper for range
    uint256 lastRange;
    /// @dev Mapping a index to its respective lottery instance
    mapping(uint256 => lotteryInstance) public tokenFrenzy;
    /// @notice Check the status of the VRF2 request 
    mapping(uint256 => RequestStatus) public statuses;     
    /// @dev LINK token is used to pay for random number 
    address public linkAddress;
    /// @dev Address of Chainlink VRFWAPPER
    address public vrfWrapperAddress;
    /// @dev WETH ERC20 token is accepted by default for the lottery and is used to calculate the worth of other tokens
    address public WETH;
    /// @dev Gas limit for callback function neccessary for VRF2
    uint32 constant callbackGasLimit = 100000;
    /// @dev Number of randomWord request from VRF2
    uint32 constant numWords = 1;
    /// @dev Number of confirmations needed before receiving response from VRF2
    uint16 constant requestConfirmations = 3;
    /// @notice Indicating if the lottery is open
    bool public lotteryOpen;  
      
    modifier whenLotteryClosed(){
        require(!lotteryOpen,"Lottery is open!");
        _;
    }

    modifier whenLotteryOpen(){
        require(lotteryOpen,"Lottery is closed!");
        _;
    }

    constructor(address _linkAddress, address _vrfWrapperAddress, address _WETH) ConfirmedOwner(msg.sender) VRFV2WrapperConsumerBase(linkAddress,vrfWrapperAddress){
        linkAddress = _linkAddress;
        vrfWrapperAddress = _vrfWrapperAddress;
        WETH = _WETH;
    }
   
    /**
     * @notice Starts the Lottery for players to join
     * @param _acceptedTokens Addresses of accepted ERC20 tokens
     * @param _pairs Pools used for price fetching for each ERC20 token
     * @param _minBet Minimum amount of ERC20 in WETH token to enter the lottery. This includes owners fee as well
     * @param _ownersFee Owners fee in procent %
     * @param _lotteryClosingTime Timestamp of the lottery next closing date and time
     * @dev WETH ERC20 token is always accepted
    */
    function startLottery (address[] calldata _acceptedTokens,address[] calldata _pairs,uint256 _minBet,uint8 _ownersFee, uint64 _lotteryClosingTime) external onlyOwner whenLotteryClosed {
        require(_lotteryClosingTime > block.timestamp,"Closing time must be in the future");
        require(_acceptedTokens.length == _pairs.length,"Accepted tokens and pairs not the same length");

        ++index;
        lotteryInstance storage newTokenfrenzy = tokenFrenzy[index];

        newTokenfrenzy.minBet = _minBet;
        newTokenfrenzy.ownersFee = _ownersFee;
        newTokenfrenzy.lotteryClosingTime = _lotteryClosingTime;

        newTokenfrenzy.acceptedTokens[WETH] = true;
        newTokenfrenzy.listAcceptedTokens.push(WETH);

        for (uint256 i = 0 ; i < _acceptedTokens.length ; ++i){
            newTokenfrenzy.acceptedTokens[_acceptedTokens[i]] = true;
            newTokenfrenzy.pairs[_acceptedTokens[i]] = _pairs[i];
            newTokenfrenzy.listAcceptedTokens.push(_acceptedTokens[i]);
        }
        lotteryOpen = true;
    }

    /// @notice Enter the lottery 
    /// @param token Address of token to enter lottery
    /// @param amount Amount of token to enter lottery 
    function enterLottery(address token, uint256 amount) external  whenLotteryOpen{
        lotteryInstance storage newTokenfrenzy = tokenFrenzy[index];
        require(newTokenfrenzy.acceptedTokens[token],"Token not accepted!");

        uint256 amountWeth;        
        amountWeth = token == WETH ? amount : getAmountOut(token, amount);
        if (amountWeth < newTokenfrenzy.minBet) revert("Amount is less than minimum bet!");

        IERC20 tokenI = IERC20(token);
        tokenI.transferFrom(msg.sender, address(this), amount);

        newTokenfrenzy.amountTokens[token] += amount;
        newTokenfrenzy.totalBets += amountWeth;
        if(!newTokenfrenzy.enteredLottery[msg.sender]) {
            newTokenfrenzy.listEnteredLottery.push(msg.sender);
            newTokenfrenzy.wethWorth[msg.sender] += amountWeth;
        }
              
        emit EnteredLottery(msg.sender, token, amount);
    }

    /**
     * @dev given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset (from UniswapV2 Router)
     * @param token Address of token 
     * @param amountIn Amount of token
     */   
    function getAmountOut(address token, uint256 amountIn) internal view returns (uint256 amountOut) {
        uint256 reserveIn;
        uint256 reserveOut;
        address pairAddress = tokenFrenzy[index].pairs[token];
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        address token1 = pair.token1();
        (uint256 Res0, uint256 Res1,) = pair.getReserves();

        if (token1 == WETH) {
            reserveIn = Res0;
            reserveOut = Res1;
        } else {
            reserveIn = Res1;
            reserveOut = Res0;
        }

        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * 1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /// @notice Closes the lottery and requests a random number to  pick a winner
    function closeLottery() external whenLotteryOpen returns (uint256 requestId){
        require(block.timestamp >= tokenFrenzy[index].lotteryClosingTime);    
        lotteryOpen = false;
        if (tokenFrenzy[index].totalBets > 0) {
            requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);

            statuses[requestId] = RequestStatus({
                fees: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
                randomWord: 0,
                fulfilled: false
            });
    
            emit RandomRequest(requestId, index);  
        }          
        latestRequestId = requestId;
        return requestId;   
    }

    /// @dev Callback function required to get the random number from VRF2. It picks a winners and approves the spending
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override{
        require(statuses[requestId].fees > 0, "Request not found");

        statuses[requestId].fulfilled = true;
        statuses[requestId].randomWord = randomWords[0];

        emit RandomResult(requestId, index);
    }
    
    /**
     * @dev Trying to find a winner with 100 steps at a time
     *      Each player is assigned a range of numbers based on his odds. 
     *      If the random generated number % 10000 is in the player`s range he is the winner.
     */
    function findWinner() external whenLotteryClosed returns (bool) {
        uint256 requestId = latestRequestId;
        require (statuses[requestId].fulfilled,"Random not fulfilled");
        require(tokenFrenzy[index].lotteryWinner == address(0x0),"Winner already found");

        lotteryInstance storage newTokenfrenzy = tokenFrenzy[index];
        uint256 random = statuses[requestId].randomWord % 10000;
        uint256 step;
        uint256 stepIndex = winnerIndex;
        uint256 startRange = lastRange;
        uint256 endRange;
        uint256 odds;
        uint256 totalBets = newTokenfrenzy.totalBets;
        address[] memory listEnteredLottery = newTokenfrenzy.listEnteredLottery;

        while(stepIndex < listEnteredLottery.length){
            odds = (newTokenfrenzy.wethWorth[listEnteredLottery[stepIndex]] * 10000) / totalBets;
            endRange = startRange + odds -1;
            if(random >= startRange && random <= endRange) {
                newTokenfrenzy.lotteryWinner = listEnteredLottery[stepIndex];
                winnerIndex = 0;
                lastRange = 0;
                emit Winner(listEnteredLottery[stepIndex], index);
                return true;
            }

            startRange = ++endRange;
            ++stepIndex;
            ++step;

            if(step == 100) {
                lastRange = ++endRange;
                winnerIndex = stepIndex;
                return false;
            }
        }
    }

    /**
     * @notice Withdraw tokens from the closed lottery
     * @param _index Instance lottery index
     * @dev If the caller is the winner he will receive the winnings - ownersFee. If the caller is the owner he receives the ownersFee
     */
    function withdrawTokens (uint256 _index) external {
        address winner = tokenFrenzy[_index].lotteryWinner;
        require(winner != address(0x0),"Winner not found");
        uint256 fee;
        uint256 ownersFee = tokenFrenzy[_index].ownersFee;
        
        callerId caller = callerId.Random; 

        if (msg.sender == owner()) {
            fee = ownersFee;
            caller = callerId.Owner;
        }
        if (msg.sender == winner) {
            fee = 10000 - ownersFee;
            caller = callerId.Winner;
        } 
        if (caller == callerId.Random) revert("Not winner or owner");

        lotteryInstance storage newTokenfrenzy = tokenFrenzy[_index];
        address[] memory listAcceptedTokens = tokenFrenzy[_index].listAcceptedTokens;
        uint256 amount;
        uint256 balance;

        for (uint256 i = 0; i < listAcceptedTokens.length; ++i) {
            balance = newTokenfrenzy.amountTokens[listAcceptedTokens[i]];
            if (balance > 0) {
                IERC20 token = IERC20(listAcceptedTokens[i]);
                amount = (balance * fee) / 10000;
                token.transfer(msg.sender, amount);         
            }
        }
    }

    function getOdds(address target) public view returns (uint256 odds) {
        lotteryInstance storage newTokenfrenzy = tokenFrenzy[index];
        uint256 balance = newTokenfrenzy.wethWorth[target];
        uint256 totalBets = newTokenfrenzy.totalBets;
        return odds = (balance * 10000) / totalBets;
    }

    function getAcceptedTokens() public view returns(address[] memory){
        return tokenFrenzy[index].listAcceptedTokens;
    }
}