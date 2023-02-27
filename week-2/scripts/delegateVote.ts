import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { Ballot__factory } from '../typechain-types';
import { fallbackProvider } from './utils';
dotenv.config();

async function main() {
	// getting arguments: ballot contract address and proposal index (from 0 to 2)
	const args = process.argv.slice(2);
	const contractAddress = args[0];
	const delegate = args[1];
	// check if the arguments are valid addresses
	if (
		!ethers.utils.isAddress(contractAddress) &&
		!ethers.utils.isAddress(delegate)
	)
		throw new Error('Not a valid address!');

	const privateKey = process.env.PRIVATE_KEY;
	if (!privateKey || privateKey.length <= 0)
		throw new Error('Missing environment: Private key');
	const wallet = new ethers.Wallet(privateKey);

	// connecting to provider and getting wallet
	const provider = fallbackProvider();
	const signer = wallet.connect(provider);
	console.log(`Connected to wallet address ${wallet.address}`);

	// connecting to ballot contract
	const ballotContractFactory = new Ballot__factory(signer);
	const contract = ballotContractFactory.attach(contractAddress);
	console.log(
		`Connected to contract ${contractAddress} and delegating to ${delegate}`
	);

	// Delegate
	console.log('Delegating ...');
	const canDelegateVote = await contract.voters(delegate);
	// Voters cannot delegate to accounts that cannot vote.
	if (canDelegateVote[0].toNumber() < 1)
		throw new Error(
			`Contract Error: Delegate address: ${delegate} doesn't have the right to vote`
		);

	const delegateVoter = await contract.connect(signer).delegate(delegate);
	const delegateTx = await delegateVoter.wait();
	console.log(delegateTx);
	console.log(`${wallet.address} has delegated to ${delegate}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
