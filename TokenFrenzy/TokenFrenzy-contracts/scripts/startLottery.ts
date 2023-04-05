import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { TokenFrenzy__factory } from "../typechain-types";
import { BigNumber } from "ethers";

dotenv.config();
const api = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

async function main() {
	// CLI arguments: 1.contract address 2.array of accepted tokens 3.array of pairs for the tokens 4.minimum bet in ETH 5.owners fee (10000 = 100%) 6.lottery closing time in seconds since unix epoch 7.network (goerli or mumbai)
	const args = process.argv.slice(2);
	const contractAddress = args[0];
	if (!ethers.utils.isAddress(contractAddress))
		throw new Error(
			`Invalid parameter: ${contractAddress} not a valid address!`
		);
	const acceptedTokens = args[1].split(",");
	acceptedTokens.forEach((el) => {
		if (!ethers.utils.isAddress(el))
			throw new Error(`Invalid parameter: ${el} not a valid address!`);
	});
	const pairs = args[2].split(",");
	pairs.forEach((el) => {
		if (!ethers.utils.isAddress(el))
			throw new Error(`Invalid parameter: ${el} not a valid address!`);
	});
	const minBet = args[3];
	const ownersFee = args[4];
	const closingTime = args[5];
	const network = args[6];

	// Initialize provider, signer and contract
	const provider = new ethers.providers.AlchemyProvider(network, api);
	const signer = new ethers.Wallet(privateKey).connect(provider);

	const lotteryFactory = new TokenFrenzy__factory(signer);
	const lotteryContract = lotteryFactory.attach(contractAddress);

	// Send transaction
	const tx = await lotteryContract.startLottery(
		acceptedTokens,
		pairs,
		BigNumber.from(ethers.utils.parseEther(minBet)),
		BigNumber.from(ownersFee),
		BigNumber.from(closingTime)
	);

	const txReceipt = await tx.wait();
	console.log(`Transaction ${txReceipt.status} hash: ${txReceipt.blockHash}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
