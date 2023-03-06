import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { Ballot__factory } from '../typechain-types';
import { fallbackProvider, isPrivateKey } from './utils';
dotenv.config();

async function main() {
	// getting 2 arguments: ballot contract address and voters address
	const args = process.argv.slice(2);
	const ballotAddress = args[0];
	let voters = args[1];

	// check if the arguments are valid addresses
	if (!ethers.utils.isAddress(ballotAddress))
		throw new Error(
			`Parameter Error: Token contract address ${ballotAddress} is not a valid address`
		);

	// check if private key is valid
	const privateKey = process.env.PRIVATE_KEY;
	if (!privateKey) {
		throw new Error(
			`Environment Error: Please make sure your .env file contains a private key`
		);
	} else if (!isPrivateKey(privateKey)) {
		throw new Error(
			`Environment Error: Please make sure your private key in your .env file is a valid private key `
		);
	}

	// connecting to provider and getting wallet
	const provider = await fallbackProvider();
	const wallet = new ethers.Wallet(privateKey, provider);
	const signer = wallet.connect(provider);
	console.log(`Connected to wallet address\x1B[34m ${wallet.address} \x1B[0m`);
	if (!ethers.utils.isAddress(voters)) voters = wallet.address;

	// connecting to Ballot contract
	const ballotContractFactory = new Ballot__factory(signer);
	const ballotContract = ballotContractFactory.attach(ballotAddress);
	console.log(
		`Connected to ballot contract\x1B[34m ${ballotContract.address} \x1B[0m`
	);

	// Check the voting power
	const votersVotingPower = await ballotContract.votingPower(voters);
	const votingPowerSpent = await ballotContract.votingPowerSpent(voters);
	console.log(`\nVoting power of\x1B[31m ${voters} \x1B[0mis:`);
	const ConsoleVote = (Delegated: any, Spent: any, Remaining: any) => {
		return { Delegated, Spent, Remaining };
	};
	const consoleTable: any = {};

	consoleTable.Voting_Power = ConsoleVote(
		Number(ethers.utils.formatEther(votersVotingPower)),
		Number(ethers.utils.formatEther(votingPowerSpent)),
		Number(ethers.utils.formatEther(votersVotingPower.sub(votingPowerSpent)))
	);

	console.table(consoleTable);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
