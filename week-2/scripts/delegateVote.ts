import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Ballot__factory } from "../typechain-types";
import { convertStringArrayToBytes32, fallbackProvider } from "./utils";

require("dotenv").config();



async function main() {
  // We recive the delegate address and contract address as argumrnts
  const [contractAddress, delegateAddress, isDev] = process.argv.slice(2, 4);

  // Checking that the required addresses exist and are valid
  if (!contractAddress) throw new Error("Missing Environment: Contract Address")
  else if (!ethers.utils.isAddress(contractAddress)) throw new Error(`Enviroment Variable Error: ${contractAddress} is not a valid address.`)
  if (!delegateAddress) throw new Error("Missing Parameters: Address to delegate vote to")
  else if (!ethers.utils.isAddress(delegateAddress)) throw new Error(`Enviroment Variable Error: ${delegateAddress} is not a valid address.`)


  //test-net wallet and signer setup
  const provider = fallbackProvider();
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private Key");
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);
  const signer = wallet.connect(provider);
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(contractAddress);

  //Ballot.sol reverts without reason if delegate cannot vote
  //so we catch this before reversion and return a meanigful error
  const canDelegateVote = (await(ballotContract.voters(delegateAddress))).weight;
  console.log(`Connected to contract at ${contractAddress}`)
  if (!canDelegateVote) throw new Error(`Contract Error: Delegate address: ${delegateAddress} doesn't have the right to vote`)

  //Wait for tx to be included 
  const deligation = await ballotContract.delegate(delegateAddress);
  const tx = await deligation.wait();

  console.log(tx);
  console.log(`delegated vote from: ${signer.address}\nto: ${delegateAddress}`);
}

main().catch(error => {
  console.log(error);
  process.exitCode = 1;
});
