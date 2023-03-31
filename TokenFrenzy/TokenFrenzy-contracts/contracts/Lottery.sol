// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title A ERC20 token lottery contract with a twist. A player can enter the lottery with any ERC20 token (accepted by the lottery) and his odds of winning are calculated at the current price (entering the lottery) in WETH. This introduce a "mindgame" to "hunt" a better token pricing from the pool to increase the probability of winning the lottery.
/// @author Stefan B
/// @dev This contract implements randomness source from Chainlink VRF2
contract Lottery is Ownable{
    /// @dev Timestamp of the lottery next closing date and time
    uint256 public lotteryClosingTime;
    /// @notice Minimum amount of ERC20 in WETH token to enter the lottery
    uint256 public minBet;
    /// @notice Indicating if the lottery is open on not
    bool public lotteryOpen;
    /// @notice Accepted ERC20 tokens for the lottery. All accepted tokens need to have a Uniswap pool with WETH token. The manager of the lottery is responsible for making sure the accepted token pools are liquid and the price cannot be easily be manipulated
    mapping (address => bool) public acceptedTokens;
    /// @dev Pools used for price fetching for each ERC20 token
    mapping (address => address) pools;
    /// @dev Amount of ERC20 tokens received by the open lottery
    mapping (address => uint) amountReceived;
    /// @notice Odds of winning the lottery in %
    mapping (address => uint) public odds;
    /// @dev List of ERC20 tokens received by the open lottery 
    address[] receivedTokens;
    
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
    /// @param _pools Pools used for price fetching for each ERC20 token
    /// @param _minBet Minimum amount of ERC20 in WETH token to enter the lottery
    /// @param closingTime Timestamp of the lottery next closing date and time
    /// @dev WETH ERC20 token is always accepted
    function startLottery (address[] calldata _acceptedTokens,address[] calldata _pools,uint256 _minBet, uint256 closingTime) external onlyOwner whenLotteryClosed {
        require(closingTime > block.timestamp,"Closing time must be in the future!");
        require(_acceptedTokens.length == _pools.length);
        minBet = _minBet;
        for (uint256 i =0 ; i < _acceptedTokens.length ; i++){
            acceptedTokens[_acceptedTokens[i]] = true;
        }
        lotteryOpen = true;
    }
}