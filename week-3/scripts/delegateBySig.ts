import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { BigNumber } from "ethers";
import { MyToken__factory } from "../typechain-types";
import { fallbackProvider } from "./utils";
import { tokenAbi } from "../scripts/abi";

dotenv.config();

async function main() {
  // require 3 arguments, 1.token contract address 2.delegatee address 3.expiry date as seconds since unix epoch
  const args = process.argv.slice(2);
  const tokenAddress = args[0];
  const delegatee = args[1];
  const expiry = BigNumber.from(args[2]);

  // check if arguments are valid
  if (!ethers.utils.isAddress(tokenAddress)) throw new Error(`Invalid parameter: ${tokenAddress} is not a valid address!`);

  if (!ethers.utils.isAddress(delegatee)) throw new Error(`Invalid parameter: ${delegatee} is not a valid address!`);

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

  const nonce = await ethers.provider.getTransactionCount(signer.address);
  const contractInterface = new ethers.utils.Interface(tokenAbi);

  const hash = ethers.utils.keccak256(contractInterface._abiCoder.encode(["address", "uint256", "uint256"], [delegatee, nonce, expiry]));
  const signed = await signer.signMessage(hash);

  const a = ethers.utils.splitSignature(signed);

  const tx = await tokenContract.delegateBySig(delegatee, nonce, expiry, a.v, a.r, a.s);
  await tx.wait();
  console.log(`${delegatee} has received voting power`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
