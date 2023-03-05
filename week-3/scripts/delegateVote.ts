import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { MyToken__factory } from '../typechain-types';
import { fallbackProvider, isPrivateKey } from './utils';
import { BigNumber, BigNumberish } from 'ethers';
dotenv.config();

async function main() {
	// getting 2 arguments: token contract address and delegatee address
	const args = process.argv.slice(2);
	const tokenAddress = args[0];
	const delegatee = args[1];
	
    // check if the arguments are valid addresses
	if (!ethers.utils.isAddress(tokenAddress))
	    throw new Error(`Parameter Error: Token contract address ${tokenAddress} is not a valid address`);
    if(!ethers.utils.isAddress(delegatee))
    throw new Error(`Parameter Error: Delegatee address ${delegatee} is not a valid address`);
	
	// check if private key is valid
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey){
        throw new Error(`Environment Error: Please make sure your .env file contains a private key`);
    }else if(!isPrivateKey(privateKey)){
        throw new Error(`Environment Error: Please make sure your private key in your .env file is a valid private key `)
    }

    // connecting to provider and getting wallet
	const provider = await fallbackProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
	const signer = wallet.connect(provider);
	console.log(`Connected to wallet address ${wallet.address}`);

	// connecting to token contract
	const MyTokenContractFactory = new MyToken__factory(signer);
	const tokenContract = MyTokenContractFactory.attach(tokenAddress);
	console.log(`Connected to token contract ${tokenContract.address}`);

    // Check the voting power of delegatee
    let tokenBalanceDelegatee = await tokenContract.balanceOf(delegatee);
    console.log(`Delegatee has a balance of ${ethers.utils.formatEther(tokenBalanceDelegatee)}`);
    let delegateeVotingPower = await tokenContract.getVotes(delegatee);
    console.log(`Delegatee voting power is ${ethers.utils.formatEther(delegateeVotingPower)}`);
     
	// Delegate
	console.log('Delegating ...');
	const delegateTx = await tokenContract.connect(wallet).delegate(delegatee);
	const delegateTxReceipt = await delegateTx.wait();
	console.log(`${wallet.address} has delegated to ${delegatee}`);

    // Check the voting power again
    tokenBalanceDelegatee = await tokenContract.balanceOf(delegatee);
    console.log(`Delegatee has a balance of ${ethers.utils.formatEther(tokenBalanceDelegatee)}`);
    delegateeVotingPower = await tokenContract.getVotes(delegatee);
    console.log(`Delegatee voting power is ${ethers.utils.formatEther(delegateeVotingPower)}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});