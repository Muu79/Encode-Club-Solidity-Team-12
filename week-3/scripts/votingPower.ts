import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { MyToken__factory, Ballot__factory } from '../typechain-types';
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
	console.log(`Connected to wallet address ${wallet.address}`);
	if (!ethers.utils.isAddress(voters)) voters = wallet.address;

	// connecting to Ballot contract
	const ballotContractFactory = new Ballot__factory(signer);
	const ballotContract = ballotContractFactory.attach(ballotAddress);
	console.log(`Connected to ballot contract ${ballotContract.address}`);

	// Check the voting power
	const votersVotingPower = await ballotContract.votingPower(voters);
	const votingPowerSpent = await ballotContract.votingPowerSpent(voters);

	console.log(
		`Voter's voting power is ${ethers.utils.formatEther(
			votersVotingPower
		)},\n Spent voting power is ${ethers.utils.formatEther(
			votingPowerSpent
		)},\n With ${ethers.utils.formatEther(
			votersVotingPower.sub(votingPowerSpent)
		)} voting power remaining.`
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
