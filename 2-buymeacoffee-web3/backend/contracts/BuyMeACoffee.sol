// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// contract deployed 0x2e4B9bB22320C626BBf4549c833C0868F68B0DB6
contract BuyMeACoffee {
    // event to emit when a memo is created
    event NewMemo (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received from users
    Memo[] public memos;

    // Address of contract deployer
    address payable owner;
    // Withdrawal address
    address payable withdrawalAddress;
    // Minimum amount of ether to be sent
    uint256 public minEther = 0.001 ether;
    // Deploy logic
    constructor() {
        owner = payable(msg.sender);
        withdrawalAddress = owner;
    }

    //  @dev Create a new memo
    // @param _name Name of the sender
    // @param _message Message of the sender
    function buyCoffee(string memory  _name, string memory _message) public payable {
        require(msg.value >= minEther, "You need to pay at least 0.001 ETH");
        require(withdrawalAddress != address(0), "Withdrawal address should be set and it should be a payable address.");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        // emit a log event when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
        withdrawalAddress.transfer(msg.value);
    }

    //  @dev Send the entire balance stored in this contract to the owner
    function withdrawTips() public {
        require(isOwner(), "Only the contract owner can withdraw tips.");
        require(withdrawalAddress != address(0), "Withdrawal address should be set and it should be a payable address.");
        withdrawalAddress.transfer(address(this).balance);
    }

    function getWithdrawalAddress() public view returns (address) {
        return withdrawalAddress;
    }

    //  @dev retrieve the all memos received and stored on the blockchain
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
    //  @dev function to check if the msg.sender is the contract owner
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
    //  @dev function to update the withdrawal address
    function setWithdrawalAddress(address payable _withdrawalAddress) public {
        require(isOwner(), "Only the contract owner can set the withdrawal address.");
        withdrawalAddress = _withdrawalAddress;
    }
}
