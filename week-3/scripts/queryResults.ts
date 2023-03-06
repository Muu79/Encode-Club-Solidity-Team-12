import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';
import {
  bytesToString,
  fallbackProvider,
  isAddressValid,
  isPrivateKey,
} from './utils';
import * as dotenv from 'dotenv';
dotenv.config();

const { PRIVATE_KEY } = process.env;

async function main() {
  // getting argument: ballot contract address
  const args = process.argv.slice(2);
  const contractAddress = args[0];

  if (!contractAddress || !isAddressValid(contractAddress))
    throw new Error('Invalid Or Missing Required Argument: Contract address');

  if (!PRIVATE_KEY || !isPrivateKey(PRIVATE_KEY))
    throw new Error('Missing environment: Private key');

  // connecting to provider and getting wallet
  const provider = await fallbackProvider();

  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signer = wallet.connect(provider);

  // connecting to ballot contract
  const ballotContractFactory = new Ballot__factory(signer);
  const contract = ballotContractFactory.attach(contractAddress);
  console.log(`Connected to the contract address ${contractAddress}`);

  // querying result
  console.log('\nQuering results ...');
  const winnerName = bytesToString(await contract.winnerName());
  const winnerProposalIndex = await contract.winningProposal();
  const maxVoteCount = ethers.utils.formatEther(
    (await contract.proposals(winnerProposalIndex))?.voteCount
  );

  if (maxVoteCount === ethers.utils.formatEther(0)) {
    console.log('No vote has been casted yet');
    return;
  }

  const results: any = {};
  const proposals: any = {};

  let shouldIterate = true;
  let index = 0;

  while (shouldIterate) {
    try {
      const proposal = await contract.proposals(index);
      proposals[bytesToString(proposal.name)] = ethers.utils.formatEther(
        proposal.voteCount
      );
      if (ethers.utils.formatEther(proposal.voteCount) == maxVoteCount) {
        results[bytesToString(proposal.name)] = ethers.utils.formatEther(
          proposal.voteCount
        );
      }
    } catch (_) {
      shouldIterate = false;
    }

    index += 1;
  }

  console.table(proposals);

  if (Object.keys(results || {}).length > 1) {
    console.log(
      `it's tie between ${
        Object.keys(results || {}).length
      } members. ${Object.keys(results || {}).join(
        ', '
      )} with vote count of ${maxVoteCount} `
    );
  } else {
    console.log(`${winnerName} is winner with ${maxVoteCount} votes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
