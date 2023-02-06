// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    using SafeMath for uint256;

    ExampleExternalContract public exampleExternalContract;

    uint256 rewardRatePerSecond = 0.0001 ether;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTimestamps;

    uint256 public withdrawalDeadline = block.timestamp + 120 seconds;
    uint256 public claimDeadline = block.timestamp + 240 seconds;
    uint256 public currentBlock = 0;

    // Events
    event Stake(address indexed sender, uint256 amount);
    event Received(address, uint);
    event Execute(address indexed sender, uint256 amount);

    // Modifiers
    /*
    Checks if the withdrawal period has been reached or not
    */
    modifier withdrawalDeadlineReached( bool requireReached ) {
        uint256 timeRemaining = withdrawalTimeLeft();
        if( requireReached ) {
            require(timeRemaining == 0, "Withdrawal period is not reached yet");
        } else {
            require(timeRemaining > 0, "Withdrawal period has been reached");
        }
        _;
    }

    /*
    Checks if the claim period has ended or not
    */
    modifier claimDeadlineReached( bool requireReached ) {
        uint256 timeRemaining = claimPeriodLeft();
        if( requireReached ) {
            require(timeRemaining == 0, "Claim deadline is not reached yet");
        } else {
            require(timeRemaining > 0, "Claim deadline has been reached");
        }
        _;
    }

    /*
    Requires that the contract only be completed once!
    */
    modifier notCompleted() {
        bool completed = exampleExternalContract.completed();
        require(!completed, "Stake already completed!");
        _;
    }

    constructor(address exampleExternalContractAddress){
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
    }

    // Stake function for a user to stake ETH in our contract
    function stake() public payable withdrawalDeadlineReached(false) claimDeadlineReached(false){
        balances[msg.sender] = balances[msg.sender] + msg.value;
        depositTimestamps[msg.sender] = block.timestamp;
        emit Stake(msg.sender, msg.value);
    }

    // READ-ONLY function to calculate the interest accrued by a user based on the reward rate per second
    function getRewardInterest() public view returns (uint256) {
        // depositBlock is the block number when the user deposited their ETH
        uint256 depositBlock = depositTimestamps[msg.sender];
        // blocksBetween is the number of blocks that have passed since the user deposited their ETH
        uint256 blocksBetween = block.number.sub(depositBlock);
        // reward is the interest accrued by the user based on the reward rate per second
        uint256 reward = rewardRatePerSecond.mul(blocksBetween).mul(blocksBetween).div(2);
        console.log("Reward: %s", reward);
        return reward;
    }

    /*
    Withdraw function for a user to remove their staked ETH inclusive
    of both principal and any accrued interest
    */
    function withdraw() public withdrawalDeadlineReached(true) claimDeadlineReached(false) notCompleted {
        require(balances[msg.sender] > 0, "You have no balance to withdraw!");
        // individualBalance is the balance of the user
        uint256 individualBalance = balances[msg.sender];
        // rewardInterest is the interest accrued by the user based on the reward rate per second
        uint256 rewardInterest = getRewardInterest();
        // Calculate the interest accrued by the user based on the reward rate per second
        uint256 indBalanceRewards = individualBalance + rewardInterest;
        balances[msg.sender] = 0;

        // Transfer all ETH via call! (not transfer) cc: https://solidity-by-example.org/sending-ether
        (bool sent, bytes memory data) = msg.sender.call{value: indBalanceRewards}("");
        require(sent, "RIP; withdrawal failed :( ");
    }

    /*
    Allows any user to repatriate "unproductive" funds that are left in the staking contract
    past the defined withdrawal period
    */
    function execute() public claimDeadlineReached(true) notCompleted {
        uint256 contractBalance = address(this).balance;
        exampleExternalContract.complete{value: contractBalance}();
    }

    /*
    READ-ONLY function to calculate the time remaining before the minimum staking period has passed
    */
    function withdrawalTimeLeft() public view returns (uint256 withdrawalTimeLeft) {
        if( block.timestamp >= withdrawalDeadline) {
            return (0);
        } else {
            return (withdrawalDeadline - block.timestamp);
        }
    }

    /*
    READ-ONLY function to calculate the time remaining before the minimum staking period has passed
    */
    function claimPeriodLeft() public view returns (uint256 claimPeriodLeft) {
        if( block.timestamp >= claimDeadline) {
            return (0);
        } else {
            return (claimDeadline - block.timestamp);
        }
    }

    /*
    Time to "kill-time" on our local testnet
    */
    function killTime() public {
        currentBlock = block.timestamp;
    }

    /*
    \Function for our smart contract to receive ETH
    cc: https://docs.soliditylang.org/en/latest/contracts.html#receive-ether-function
    */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

}
