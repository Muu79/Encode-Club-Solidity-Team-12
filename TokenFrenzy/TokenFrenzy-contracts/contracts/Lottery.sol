// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title A ERC20 token lottery contract with a twist. A player can enter the Lottery with any ERC20 token (accepted by the Lottery) and his odds of winning are calculated at the current price (entering the Lottery) in WETH. This introduce a "mindgame" to "hunt" a better token pricing from the pool to increase the probability of winning the Lottery.
/// @author Stefan B
/// @dev This contract implements randomness source from Chainlink VRF2
contract Lottery is Ownable{
    /// @notice Indicating if the Lottery is open on not
    bool public lotteryOpen;
    /// @notice Accepted ERC20 tokens for the Lottery. All accepted tokens need to have a Uniswap pool with WETH token. The manager of the Lottery is responsible for making sure the accepted token pools are liquid and the price cannot be easily be manipulated
    mapping (address => bool) acceptedTokens;
    /// @notice List of tokens received by the open Lottery 
    address[] receivedTokens;
    /// @notice Odds of winning the Lottery in %
    mapping (address => uint) odds;
}