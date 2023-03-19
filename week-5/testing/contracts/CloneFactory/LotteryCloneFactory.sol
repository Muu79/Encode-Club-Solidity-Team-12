//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './CloneFactory.sol';
import {LotteryToken} from "./LotteryToken.sol";

contract LotteryCloneFactory is CloneFactory{
    Lottery[] public lotterys;
    address masterContract;

    constructor (address _masterContract){
        masterContract = _masterContract;
    }

    function createLottery(string memory tokenName,
        string memory tokenSymbol,
        uint256 _purchaseRatio,
        uint256 _betPrice,
        uint256 _betFee) external {
            Lottery lottery = Lottery(createClone(masterContract));
            lottery.init(tokenName,tokenSymbol,_purchaseRatio,_betPrice,_betFee,msg.sender);            
            lotterys.push(lottery);
        }
    
    function getLottery() external view returns(Lottery[] memory){
        return lotterys;
    }

}
