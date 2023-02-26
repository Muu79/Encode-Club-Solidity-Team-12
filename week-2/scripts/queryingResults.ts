import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types/factories/Ballot__factory";
dotenv.config();

async function main() {
  // Checking that the required addresses exist and are valid
  const contractAddress: any = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error("Missing Environment: Contract Address")
  else if (!ethers.utils.isAddress(contractAddress)) throw new Error(`Enviroment Variable Error: ${contractAddress} is not a valid address.`)
  console.log(`Connecting to contract...`);

  // connecting to provider and wallet
  const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private key");
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  console.log(`\tConnected to wallet address ${wallet.address}`);

  // initialising the contract
  const ballotContractFactory = new Ballot__factory(signer);
  const contract = ballotContractFactory.attach(contractAddress);
  console.log(`\tConnected to contract address ${contractAddress}\n`);

  // calling winningProposal on contract
  // could use winnerName function on contract to get the name of proposal
  // using winningProposal gets more data, thus used for queryingResults
  const index = await contract.winningProposal();
  const proposal = await contract.proposals(index);
  const win = proposal.voteCount;
  if (win.toNumber() == 0 ) throw new Error("Missing Votes: No votes have been casted")
  const winnerName = ethers.utils.parseBytes32String(proposal.name);
  console.log(`${winnerName} has won by ${win} votes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
