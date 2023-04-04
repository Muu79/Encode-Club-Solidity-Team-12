import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { TokenFrenzy__factory } from "../typechain-types";

dotenv.config();
const api = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

async function main() {
	const provider = new ethers.providers.AlchemyProvider("goerli", api);
	const signer = new ethers.Wallet(privateKey).connect(provider);

	const lotteryFactory = new TokenFrenzy__factory(signer);
	const lottery = await lotteryFactory.deploy();
	const deployTxReceipt = await lottery.deployTransaction.wait();

	console.log(`Contract deployed at: ${deployTxReceipt.contractAddress}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
