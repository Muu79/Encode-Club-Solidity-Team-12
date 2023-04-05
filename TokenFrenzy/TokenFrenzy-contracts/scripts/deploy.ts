import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { TokenFrenzy__factory } from "../typechain-types";

dotenv.config();
const api = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

async function main() {
	// CLI argument: 1.LINK address 2.vrfWrapper address 3.WETH address 4.network (goerli or mumbai)
	const args = process.argv.slice(2);
	const linkAddress = args[0];
	const vrfWrapperAddress = args[1];
	const wethAddress = args[2];
	const targetNetwork = args[3];
	const provider = new ethers.providers.AlchemyProvider(targetNetwork, api);
	const signer = new ethers.Wallet(privateKey).connect(provider);

	const lotteryFactory = new TokenFrenzy__factory(signer);
	const lottery = await lotteryFactory.deploy(
		linkAddress,
		vrfWrapperAddress,
		wethAddress
	);
	const deployTxReceipt = await lottery.deployTransaction.wait();

	console.log(`Contract deployed at: ${deployTxReceipt.contractAddress}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
