// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/** @title A greeting contract */
/** @author (Early) Q1 2023 TEAM 12 */
/** @notice Use this contarct to Transfer ownership, Sell ownership and update greeting */
/** @dev Ownership is traded as well. */
contract HelloWorld {
    /// @notice Greeting text
    string private text;

    /// @notice Get the address of owner of the contract
    /// @dev Owner is set at deployment
    /// @return owner the deployer or current owner of contract
    address public owner;

    /// @notice Get sellable permission to allow purchase of ownership
    /// @dev default is set to false
    /// @return sell the permission to allow purchase of contract ownership
    bool public sell;

    /// @notice Get contract ownership sell value
    /// @dev default is set to 0 ether
    /// @return amount the contract is sold for
    uint256 public amount;

    event Received(address, uint256);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /// @dev Reset stateVariable sell after ownership transfer
    modifier afterTransfer() {
        _;
        sell = false;
    }

    /// @notice Depolys the contract
    /// @dev sets `msg.sender` as the owner of the contract and assigns default values to stateVariables
    constructor() {
        owner = msg.sender;
        text = "Hello World!";
        sell = false;
        amount = 0 ether;
    }

    /// @notice Receive Ether
    /// @dev The contract can recieve payment without function calls, incase pooling is needed to purchase ownership
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @notice Fallback for wrong signature
    fallback() external {
        revert();
    }

    /// @notice Purchase ownership for `amount`
    /// @dev Checks balance in contract is greater than selling value, then sends the specified selling value Ether to msg.sender and make msg.sender the new owner.
    function buyOwnership() public payable afterTransfer {
        require(address(this).balance >= amount);
        payable(owner).transfer(amount);
        owner = msg.sender;
    }

    /// @notice Updates greeting
    /// @dev sets new value to text stateVariable
    /// @param _text string for greeting
    function setText(string calldata _text) public onlyOwner {
        text = _text;
    }

    /// @notice Transfer ownership to another address
    /// @dev Transfering ownership to self is not allowed
    /// @param _owner Address of new owner
    function transferOwnership(address _owner) public onlyOwner afterTransfer {
        require(_owner != owner, "Cannot transfer ownership to self");
        owner = _owner;
    }

    /// @notice Sell of ownership toggler
    /// @dev Toggles ownership sell permission
    function toggleSellOwnership() public onlyOwner {
        sell = !sell;
    }

    /// @notice Sell of ownership updater
    /// @dev specify the selling value for ownership of contract
    /// @param _amount is amount to sell for
    function sellOwnership(uint256 _amount) public onlyOwner {
        sell = true;
        amount = _amount;
    }

    /// @notice Returns text
    /// @dev Getter to return gretting string
    /// @return Greeting string
    function helloWorld() public view returns (string memory) {
        return text;
    }
}
