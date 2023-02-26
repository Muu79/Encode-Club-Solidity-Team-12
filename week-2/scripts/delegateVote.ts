import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Ballot__factory } from "../typechain-types";
import { convertStringArrayToBytes32, fallbackProvider } from "./utils";

require("dotenv").config();



async function main() {
  // We recive the delegate address, contract address  
  // and isDev which indicates if we should use a localhost providor
  const [contractAddress, delegateAddress, isDev] = process.argv.slice(2, 5);

  // Checking that the required addresses exist and are valid
  if (!contractAddress) throw new Error("Missing Environment: Contract Address")
  else if (!ethers.utils.isAddress(contractAddress)) throw new Error(`Enviroment Variable Error: ${contractAddress} is not a valid address.`)
  if (!delegateAddress) throw new Error("Missing Parameters: Address to delegate vote to")
  else if (!ethers.utils.isAddress(delegateAddress)) throw new Error(`Enviroment Variable Error: ${delegateAddress} is not a valid address.`)

  let ballotContract, signer;
  //dev wallet setup this is exclusivley to test functionality
  if (isDev && isDev.toLowerCase() == "true") {
    signer = (await ethers.getSigners())[0]
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    // We deploy a test contract then give the delegate the right to vote
    ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(["test1", "test2"]));
    await ballotContract.giveRightToVote(delegateAddress);
  }

  //test-net wallet and signer setup
  else {
    const provider = fallbackProvider();
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private Key");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    signer = wallet.connect(provider);
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
  }

  //Ballot.sol reverts without reason if delegate cannot vote
  //so we catch this before reversion and return a meanigful error
  const canDelegateVote = await (ballotContract.voters(delegateAddress));
  console.log(canDelegateVote);
  if (!canDelegateVote) throw new Error(`Contract Error: Delegate address: ${delegateAddress} doesn't have the right to vote`)

  //Wait for tx to be included 
  const deligation = await ballotContract.delegate(delegateAddress);
  const tx = deligation.wait();

  console.log(tx);
  console.log(`delegated vote from: ${signer.address}\nto: ${delegateAddress}`);
}

main().catch(error => {
  console.log(error);
  process.exitCode = 1;
});
