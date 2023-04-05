import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { TokenFrenzy__factory } from "../typechain-types";

dotenv.config();
const api = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

async function main() {
	// CLI arguments: 1.contract address 2.network (goerli or mumbai)
	const args = process.argv.slice(2);
	const contractAddress = args[0];
	if (!ethers.utils.isAddress(contractAddress))
		throw new Error(
			`Invalid parameter: ${contractAddress} not a valid address!`
		);

	const network = args[1];

	// Initialize provider, signer and contract
	const provider = new ethers.providers.AlchemyProvider(network, api);
	const signer = new ethers.Wallet(privateKey).connect(provider);

	const lotteryFactory = new TokenFrenzy__factory(signer);
	const lotteryContract = lotteryFactory.attach(contractAddress);

	// Send transaction
	const tx = await lotteryContract.findWinner();

	const txReceipt = await tx.wait();
	console.log(`Transaction ${txReceipt.status} hash: ${txReceipt.blockHash}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
