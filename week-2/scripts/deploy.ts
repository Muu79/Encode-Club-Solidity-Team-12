import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import { convertStringArrayToBytes32, fallbackProvider } from "./utils";
require("dotenv").config();


async function main() {
  const args = process.argv;
  const proposals = args.slice(2);
  if (proposals.length <= 0) throw new Error("Missing parameters: proposals");

  const provider = fallbackProvider();
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Mnemonic seed");
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Wallet balance: ${balance} Wei`);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotContractFactory = new Ballot__factory(signer);
  console.log("Deploying contract ...");
  const ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals));
  const deployTxReceipt = await ballotContract.deployTransaction.wait();
  console.log(`The Ballot contract was deployed at the address ${ballotContract.address}`);
  console.log({ deployTxReceipt });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
