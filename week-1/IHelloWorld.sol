// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IHelloWorld {
	function buyOwnership() external payable;
    function setText(string calldata _text) external;
    function transferOwnership (address _owner) external;
	function toggleSellOwnership() external;
	function sellOwnership(uint _amount) external;
	function helloWorld() external view returns (string memory);
}

