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
  console.log(`Connected to wallet address \x1B[34m${wallet.address}\x1B[0m`);

  // connecting to ballot contract
  const ballotContractFactory = new Ballot__factory(signer);
  const contract = ballotContractFactory.attach(contractAddress);
  console.log(
    `Connected to contract address \x1B[34m${contractAddress}\x1B[0m`
  );

  // voting
  console.log('Voting in progress ...');
  const vote = await contract.vote(proposal, ethers.utils.parseEther(amount));
  await vote.wait();
  const proposalName = (await contract.proposals(proposal)).name;
  console.log(
    `Address \x1B[34m${
      wallet.address
    }\x1B[0m has voted for \x1B[32m${ethers.utils.parseBytes32String(
      proposalName
    )}\x1B[0m`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
