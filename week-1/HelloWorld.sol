// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/** A greeting contract */
/** @title Hello World */
/** @dev Transfer ownership, Sell ownership and update greeting */
contract HelloWorld {
    string private text;
    address public owner;
	bool public sell;
	uint public amount;

    event Received(address, uint);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

	/// Reset state sell after ownership transfer
    modifier afterTransfer {
        _;
        sell = false;
    }

    constructor() {
        text = "Hello World!";
        owner = msg.sender;
		sell = false;
		amount = 0 ether;
    }
    
	/// The contract can recieve payment without function calls
	/// @dev incase pooling is needed to purchase ownership
	receive() external payable {
		emit Received(msg.sender, msg.value);
	}

	/// Fallback for wrong signature
    fallback(bytes calldata input) external returns (bytes memory output) {
    	output = abi.encodePacked("Failed to get function: ",input);
    }

    /// Purchase ownership
	/// Buy ownership for `amount`
    /// @dev Checks balance in contract is greater than specified amount
	function buyOwnership() public payable afterTransfer {
		require(address(this).balance >= amount);
		payable(owner).transfer(amount);
		owner = msg.sender;
	}

    /// Updates greeting
    /// @param _text string for greeting
    function setText(string calldata _text) public onlyOwner {
        text = _text;
    }

    /// Transfer ownership to another address
    /// @param _owner Address of new owner
    function transferOwnership(address _owner) public onlyOwner afterTransfer {
		require(_owner != owner, "Cannot transfer ownership to self");
        owner = _owner;
    }

    /// Sell of ownership toggler
	function toggleSellOwnership() public onlyOwner {
		sell = !sell;
	}

    /// Sell of ownership updater
    /// @param _amount is amount to sell for
	function sellOwnership(uint _amount) public onlyOwner {
		sell = true;
		amount = _amount;
	}

    /// Returns text
    function helloWorld() public view returns (string memory) {
        return text;
    }
    
}

