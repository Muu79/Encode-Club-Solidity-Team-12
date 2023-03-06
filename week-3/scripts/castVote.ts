import { ethers } from 'hardhat';
import { fallbackProvider, isPrivateKey } from './utils';
import { Ballot__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // getting arguments: tokenised ballot contract address and proposal index (from 0 to 2)
  const args = process.argv.slice(2);
  const contractAddress = args[0];
  const proposal = args[1];
  const amount = args[2];

  if (!ethers.utils.isAddress(contractAddress))
    throw new Error('Not a valid address!');

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || !isPrivateKey(privateKey))
    throw new Error('Missing environment: Private key');

  // connecting to provider and getting wallet
  const provider = await fallbackProvider();
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  console.log(`Connected to wallet address ${wallet.address}`);

  // connecting to ballot contract
  const ballotContractFactory = new Ballot__factory(signer);
  const contract = ballotContractFactory.attach(contractAddress);
  console.log(`Connected to contract address ${contractAddress}`);

  // voting
  console.log('Voting in progress ...');
  const vote = await contract
    .connect(signer)
    .vote(proposal, ethers.utils.parseEther(amount));
  const voteTx = await vote.wait();
  console.log(voteTx);
  console.log(`${wallet.address} has voted`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
