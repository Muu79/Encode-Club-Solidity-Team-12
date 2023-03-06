import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
import { fallbackProvider } from "./utils";
import { BigNumber } from "ethers";
import { formatEther } from "@ethersproject/units";

dotenv.config();

async function main() {
  // require 3 arguments, 1.token contract address 2.address to receive tokens 3.amount of tokens the address receives
  const args = process.argv.slice(2);
  const tokenAddress = args[0];
  const voter = args[1];
  const amount = ethers.utils.parseEther(args[2]);

  // check if arguments are valid
  if (!ethers.utils.isAddress(tokenAddress)) throw new Error(`${tokenAddress} is not a valid address!`);

  if (!ethers.utils.isAddress(voter)) throw new Error(`${voter} is not a valid address!`);

  if (!ethers.BigNumber.isBigNumber(amount) || amount.toNumber() <= 0) throw new Error(`${amount} is not a valid number!`);

  // connecting to wallet and provider
  const provider = await fallbackProvider();

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private key");
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  // initialise the contract
  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(tokenAddress);

  console.log(`Connected to contract ${tokenAddress}`);

  const mintTx = await tokenContract.mint(voter, amount);
  await mintTx.wait();
  const tokenBalance = await tokenContract.balanceOf(voter);
  console.log(`${voter} received ${formatEther(amount)} of ${await tokenContract.symbol()}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
