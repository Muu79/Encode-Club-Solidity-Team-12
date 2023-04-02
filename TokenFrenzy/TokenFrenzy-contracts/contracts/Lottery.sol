// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";

/**
 * @title A ERC20 token lottery contract with a twist.
 * A player can enter the lottery with any ERC20 token (accepted by the lottery)
 * and his odds of winning are calculated at the current price (entering the lottery) in WETH.
 * This introduce a "mindgame" to "hunt" a better token pricing from the pool to increase the probability of winning the lottery.
 * @author Stefan B 
 * @dev This contract implements randomness source from Chainlink VRF2 
 * 
 */
contract Lottery is Ownable{
    /// @dev WETH ERC20 token is accepted by default for the lottery
    address constant WETH = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    /// @dev Timestamp of the lottery next closing date and time
    uint256 public lotteryClosingTime;
    /// @notice Minimum amount of ERC20 in WETH token to enter the lottery
    uint256 public minBet;   
    /// @dev Total amount of bets in WETH
    uint256 totalBets; 
    /// @notice Indicating if the lottery is open
    bool public lotteryOpen;
    /// @notice Accepted ERC20 tokens for the lottery. All accepted tokens need to have a trading pool with WETH token. The manager of the lottery is responsible for making sure the accepted token pools are liquid and the price cannot be easily be manipulated
    mapping (address => bool) public acceptedTokens;
    /// @dev Pairs used for price fetching for each ERC20 token
    mapping (address => address) pairs;

    // /// @dev Amount of ERC20 tokens received by the open lottery
    // mapping (address => uint) public amountReceived;

    /// @notice Odds of winning the lottery in %
    /// @dev Proccents are with 2 "decimals". 1000 = 10%
    mapping (address => uint) public odds;
    /// @dev Amount received from each token
    mapping (address => uint) amountTokens;
    /// @dev List of ERC20 tokens received by the open lottery 
    address[] receivedTokens;
    /// @dev List of accepted ERC20 tokens
    address[] listAcceptedTokens;
    
    modifier whenLotteryClosed(){
        require(!lotteryOpen,"Lottery is open!");
        _;
    }

    modifier whenLotteryOpen(){
        require(lotteryOpen,"Lottery is closed!");
        _;
    }
   
    /// @notice Starts the Lottery for players to join
    /// @param _acceptedTokens Addresses of accepted ERC20 tokens
    /// @param _pairs Pools used for price fetching for each ERC20 token
    /// @param _minBet Minimum amount of ERC20 in WETH token to enter the lottery
    /// @param closingTime Timestamp of the lottery next closing date and time
    /// @dev WETH ERC20 token is always accepted
    function startLottery (address[] calldata _acceptedTokens,address[] calldata _pairs,uint256 _minBet, uint256 closingTime) external onlyOwner whenLotteryClosed {
        require(closingTime > block.timestamp,"Closing time must be in the future!");
        require(_acceptedTokens.length == _pairs.length);
        acceptedTokens[WETH] = true;
        minBet = _minBet;
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
        token == WETH ? amountWeth = amount : amountWeth = getAmountOut(token, amount);
        if (amountWeth < minBet) revert("Amount is less than minimum bet!");
        IERC20 tokenI = IERC20(token);
        tokenI.transferFrom(msg.sender, address(this), amount);
        totalBets += amountWeth;
        uint256 odd = (amount * 1000) / totalBets;
        odds[msg.sender] += odd;
        amountTokens[token] += amount;
        for (uint256 i = 0; i < receivedTokens.length; i++){
            if (token == receivedTokens[i]) return;
        }
        receivedTokens.push(token);
    }

    /// @notice given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset (from UniswapV2 Router)
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

    /// @notice Closes the lottery and picks a winner
    function closeLottery() external whenLotteryOpen{
        require(block.timestamp >= lotteryClosingTime);
        //TODO
        uint256 random = getRandom();
    }    
}