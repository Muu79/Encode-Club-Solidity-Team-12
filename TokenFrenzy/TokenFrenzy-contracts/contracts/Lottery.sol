// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "./interfaces/IUniswapV2Pair.sol";

/**
 * @title A ERC20 token lottery contract
 * A player can enter the lottery with any ERC20 token (accepted by the lottery)
 * and his odds of winning are calculated at the current price (entering the lottery) in WETH.
 * This introduce a "mindgame" to "hunt" a better token pricing from the pool to increase the probability of winning the lottery.
 * @author Stefan B 
 * @dev This contract implements randomness source from Chainlink VRF2 
 * 
 */
contract Lottery is VRFV2WrapperConsumerBase,
    ConfirmedOwner {
    event EnteredLottery(address sender, address token, uint256 amount); 
    event RandomRequest(uint256 requestId);
    event RandomResult(uint256 requestId);
    event Winner(address winner);

    struct RequestStatus {
        uint256 fees;
        uint256 randomWord;
        bool fulfilled; 
    }

    /// @notice Check the status of the VRF2 request 
    mapping(uint256 => RequestStatus)
        public statuses; 
    /// @notice Accepted ERC20 tokens for the lottery. All accepted tokens need to have a trading pool with WETH token. The manager of the lottery is responsible for making sure the accepted token pools are liquid and the price cannot be easily be manipulated
    mapping (address => bool) public acceptedTokens;
    /// @dev Pairs used for price fetching for each ERC20 token
    mapping (address => address) pairs;
    /// @dev Amount received from each token
    mapping (address => uint) amountTokens;
    /// @dev Amount of tokens deposited by players in WETH
    mapping (address => uint256) wethWorth;
    
    /// @dev LINK token is used to pay for random number 
    address constant linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    /// @dev Address of Chainlink VRFWAPPER
    address constant vrfWrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;
    /// @dev WETH ERC20 token is accepted by default for the lottery
    address constant WETH = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    /// @notice Address of loterry winner
    address lotteryWinner;
    /// @dev List of ERC20 tokens received by the open lottery 
    address[] receivedTokens;
    /// @dev List of accepted ERC20 tokens
    address[] listAcceptedTokens;
    /// @dev List of players that entered the lottery
    address[] enteredLottery;
    /// @dev Gas limit for callback function
    uint32 constant callbackGasLimit = 100000;
    /// @dev Number of randomWord requested
    uint32 constant numWords = 1;
    /// @dev Number of confirmations needed before receiving response from VRF2
    uint16 constant requestConfirmations = 3;
    /// @dev Timestamp of the lottery next closing date and time
    uint256 public lotteryClosingTime;
    /// @notice Minimum amount of ERC20 in WETH token to enter the lottery
    uint256 public minBet;   
    /// @notice Owners fee
    uint256 public ownersFee;
    /// @dev Total amount of bets in WETH
    uint256 totalBets; 
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

    constructor() ConfirmedOwner(msg.sender) VRFV2WrapperConsumerBase(linkAddress,vrfWrapperAddress){}
   
    /// @notice Starts the Lottery for players to join
    /// @param _acceptedTokens Addresses of accepted ERC20 tokens
    /// @param _pairs Pools used for price fetching for each ERC20 token
    /// @param _minBet Minimum amount of ERC20 in WETH token to enter the lottery. This includes owners fee as well
    /// @param _ownersFee Owners fee in procent %
    /// @param _lotteryClosingTime Timestamp of the lottery next closing date and time
    /// @dev WETH ERC20 token is always accepted
    function startLottery (address[] calldata _acceptedTokens,address[] calldata _pairs,uint256 _minBet,uint8 _ownersFee, uint256 _lotteryClosingTime) external onlyOwner whenLotteryClosed {
        require(_lotteryClosingTime > block.timestamp,"Closing time must be in the future!");
        require(_acceptedTokens.length == _pairs.length);
        lotteryWinner = address(0x0);
        totalBets = 0;
        delete receivedTokens;
        delete enteredLottery;
        acceptedTokens[WETH] = true;
        minBet = _minBet;
        ownersFee = _ownersFee;
        lotteryClosingTime = _lotteryClosingTime;
        for (uint256 i = 0 ; i < _acceptedTokens.length ; i++){
            acceptedTokens[_acceptedTokens[i]] = true;
            pairs[_acceptedTokens[i]] = _pairs[i];
            listAcceptedTokens.push(_acceptedTokens[i]);
        }
        lotteryOpen = true;
    }

    /// @notice Enter the lottery 
    /// @param token Address of token to enter lottery
    /// @param amount Amount of token to enter lottery 
    function enterLottery(address token, uint256 amount) external  whenLotteryOpen{
        require(acceptedTokens[token],"Token not accepted!");
        uint256 amountWeth;
        bool entered;
        amountWeth = token == WETH ? amount : getAmountOut(token, amount);
        if (amountWeth < minBet) revert("Amount is less than minimum bet!");

        IERC20 tokenI = IERC20(token);
        tokenI.transferFrom(msg.sender, address(this), amount);
        totalBets += amountWeth;

        wethWorth[msg.sender] += amountWeth;
        amountTokens[token] += amount;
        
        address[] memory _enteredLottery = enteredLottery;
        for (uint256 i = 0; i < _enteredLottery.length ; i++) {
            if (msg.sender == _enteredLottery[i]) entered = true;
        }
        if (!entered) enteredLottery.push(msg.sender);

        address[] memory _receivedTokens = receivedTokens;
        bool rec;
        for (uint256 i = 0; i < _receivedTokens.length; i++) {
            if (token == _receivedTokens[i]) rec = true;
        }
        if(!rec) receivedTokens.push(token);
        emit EnteredLottery(msg.sender, token, amount);
    }

    /// @dev given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset (from UniswapV2 Router)
    /// @param token Address of token 
    /// @param amountIn Amount of token
    function getAmountOut(address token, uint256 amountIn) internal view returns (uint256 amountOut) {
        uint256 reserveIn;
        uint256 reserveOut;
        address pairAddress = pairs[token];
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
        require(block.timestamp >= lotteryClosingTime);    
        lotteryOpen = false;
        if (totalBets > 0) {
            requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);

            statuses[requestId] = RequestStatus({
                fees: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
                randomWord: 0,
                fulfilled: false
            });

            for (uint256 i = 0; i < listAcceptedTokens.length; i++){
                acceptedTokens[listAcceptedTokens[i]] = false;
            }
            delete listAcceptedTokens;
    
            emit RandomRequest(requestId);  
            return requestId;   
        }
          
    }

    /// @dev Callback function required to get the random number from VRF2. It picks a winners and approves the spending
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override{
        require(statuses[requestId].fees > 0, "Request not found");

        statuses[requestId].fulfilled = true;
        statuses[requestId].randomWord = randomWords[0];

        lotteryWinner = pickWinner(randomWords[0] % 10000);

        emit Winner(lotteryWinner);
    }

    /// @dev Picks a winner based on random number and odds
    function pickWinner(uint256 random) internal returns(address winner) {
        uint256 startRange;
        uint256 endRange;
        uint256 odds;
        address[] memory _enteredLottery = enteredLottery;
        for (uint256 i = 0 ; i < _enteredLottery.length; i++) {
            odds = (wethWorth[_enteredLottery[i]] * 10000) / totalBets;
            endRange = startRange + odds - 1;
            wethWorth[_enteredLottery[i]] = 0;
            if (random >= startRange && random <= endRange) winner = _enteredLottery[i];
            startRange += endRange + 1;
        }        
    }  

    /// @notice Withdraw the tokens to the winners
    function winningsWithdraw() external {
        require(lotteryWinner == msg.sender,"Not the winner");
        uint256 amount;
        address[] memory _receivedTokens;
        for (uint256 i = 0; i < _receivedTokens.length; i++) {
            IERC20 token = IERC20(_receivedTokens[i]);
            amount = amountTokens[_receivedTokens[i]] * (10000 - ownersFee) / 10000;
            amountTokens[receivedTokens[i]] -= amount;
            token.transfer(msg.sender, amount);         
        }
    }  

    /// @notice Withdraw the fee tokens to the owner
    function ownerWithdraw() external onlyOwner{
        address[] memory _receivedTokens;
        uint256 amount;
        for (uint256 i = 0; i < _receivedTokens.length; i++) {
            IERC20 token = IERC20(_receivedTokens[i]);
            amount = amountTokens[_receivedTokens[i]];
            amountTokens[receivedTokens[i]] -= amount;
            token.transfer(msg.sender, amountTokens[_receivedTokens[i]]);         
        }       
    }
}