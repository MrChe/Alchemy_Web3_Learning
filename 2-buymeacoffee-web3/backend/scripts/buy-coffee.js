// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Returns the Ether balance of the given address.
async function getBalance(address) {
  const balanceBigint = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigint);
}

// Logs the Ether balance of the given address.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx}: ${address} Balance: ${await getBalance(address)}`);
    idx++;
  }
}

// Logs the memos stored in on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp =  memo.timestamp;
    const tipper =  memo.name;
    const tipperAddress =  memo.from;
    const message =  memo.message;

    console.log(`Timestamp: ${timestamp} Tipper: ${tipper} Address: ${tipperAddress} Message: ${message}`);
  }
}

async function main() {
  // Get example accounts.
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy & deploy.
  // This is main contract that should collect tips (ethers)
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("===== Balances before coffee purchase =====");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("Tipper 1", "Thanks for the great tutorial!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Tipper 2", "Thanks for the new friends!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Tipper 3", "Thanks for the children!", tip);
  // Check balances after the coffee purchase.
  console.log("===== Balances after coffee purchase =====");
  await printBalances(addresses);
  // Withdraw funds.
  await buyMeACoffee.withdrawTips();
  // Check balances after the withdrawal.
  console.log("===== Balances after withdraw tips =====");
  await printBalances(addresses);
  // Read all the memos left for the owner.

  console.log("===== Memos =====");
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
