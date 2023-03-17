// $ npx hardhat run scripts/verify.ts --network goerli

import { ethers, run } from 'hardhat';
require("dotenv").config();

let contractAddress: string | undefined;
let tokenAddress: string | undefined;
const contractPathName = "contracts/Lottery.sol:Lottery";
const tokenPathName = "contracts/LotteryToken.sol:LotteryToken";

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
    contractAddress = process.env.CONTRACT_ADDRESS;
    tokenAddress = process.env.TOKEN_ADDRESS;

	await run("verify:verify", {
		address: contractAddress,
		contract: contractPathName,
		constructorArguments: [
			'LotteryToken',
			'LT0',
			TOKEN_RATIO,
			ethers.utils.parseEther(BET_PRICE.toFixed(18)),
			ethers.utils.parseEther(BET_FEE.toFixed(18))
		],
	}); 
	console.log(`The Lottery contract at the address ${contractAddress} was verified.`);

	await run("verify:verify", {
		address: tokenAddress,
		contract: tokenPathName,
		constructorArguments: [
			'LotteryToken',
			'LT0'
		],
	}); 
	console.log(`The Token contract at the address ${tokenAddress} was verified.`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});