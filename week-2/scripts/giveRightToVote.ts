import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types/factories/Ballot__factory";
dotenv.config();

async function main() {
  // require 2 arguments. First represents the contract address and the second the address to receive vote right
  const args = process.argv.slice(2);
  const contractAddress = args[0];
  const voter = args[1];

  // check if the arguments are valid addresses
  if (!ethers.utils.isAddress(contractAddress) && !ethers.utils.isAddress(voter)) throw new Error("Not a valid address!");

  // connecting to provider and wallet
  const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private key");
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  console.log(`Connected to the wallet address ${wallet.address}`);

  // initialising the contract
  const ballotContractFactory = new Ballot__factory(signer);
  // const contract = await ethers.getContractAt("Ballot", contractAddress, signer);
  const contract = ballotContractFactory.attach(contractAddress);

  // giving vote right
  console.log(`Connected to contract ${contractAddress} and giving vote right to ${voter}`);

  console.log(voter);

  // calling giveRightToVote on contract
  const voteRight = await contract.giveRightToVote(voter);
  const txReceipt = await voteRight.wait();
  console.log(txReceipt);
  console.log(`${voter} has received a right to vote`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
