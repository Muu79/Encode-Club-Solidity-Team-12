import { ethers } from "hardhat";
import { boolean } from "hardhat/internal/core/params/argumentTypes";
import { Ballot__factory } from "../typechain-types";

const ballotABI = require("../contracts/Ballot.json")

require("dotenv").config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function delegateVote() {
  const [delegateAddress, isDev] = process.argv.slice(2, 4);
  const contractAddress: any = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error("Missing environment: Contract Address")
  if (!delegateAddress) throw new Error("Missing parameters: Address to delegate vote to")

  let ballotContract, signer;
  //dev wallet setup
  if (isDev == "true") {
    signer = (await ethers.getSigners())[0]
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(["test1", "test2"]));
    ballotContract.giveRightToVote(delegateAddress);
  }

  //test-net wallet setup
  else {
    const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private Key");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    signer = wallet.connect(provider);
    ballotContract = new ethers.Contract(contractAddress, ballotABI, signer);
  }

  const canDelegateVote = (await ballotContract.voters(delegateAddress))[3];
  //Ballot.sol reverts without reason if delegate cannot vote
  //so we catch this before reversion and return a meanigful error below
  if (!canDelegateVote) throw new Error("Contract error: Delegate address doesn't have the right to vote")
  const tx = await ballotContract.connect(signer).delegate(delegateAddress);
  console.log(tx);
}

delegateVote().catch(error => {
  console.log(error);
  process.exitCode = 1;
});
