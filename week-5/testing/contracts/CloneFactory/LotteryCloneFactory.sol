//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './CloneFactory.sol';
import './Lottery.sol';
import {LotteryToken} from "./LotteryToken.sol";
import {LotteryClone} from "./LotteryClone.sol";

contract LotteryCloneFactory is CloneFactory{
    LotteryClone[] public lotterys;
    address masterContract;

    constructor (address _masterContract){
        masterContract = _masterContract;
    }

    function createLottery(string memory tokenName,
        string memory tokenSymbol,
        uint256 _purchaseRatio,
        uint256 _betPrice,
        uint256 _betFee) external {
            LotteryClone lottery = LotteryClone(createClone(masterContract));
            lottery.init(tokenName,tokenSymbol,_purchaseRatio,_betPrice,_betFee,msg.sender);            
            lotterys.push(lottery);
        }
    
    function getLottery() external view returns(LotteryClone[] memory){
        return lotterys;
    }

}
