import { ethers, run } from 'hardhat';
import { Lottery, LotteryToken, Lottery__factory } from '../typechain-types';
import { fallbackProvider } from "./utils";
require("dotenv").config();

let contract: Lottery;
let token: LotteryToken;
let tokenAddress: string;
const contractPathName = "contracts/Lottery.sol:Lottery";
const tokenPathName = "contracts/LotteryToken.sol:LotteryToken";

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
	const provider = fallbackProvider();
	const privateKey = process.env.PRIVATE_KEY;
	if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Mnemonic seed");
	const wallet = new ethers.Wallet(privateKey);
	console.log(`Connected to the wallet address ${wallet.address}`);
	const signer = wallet.connect(provider);
	
	// deploying contracts

	const contractFactory = new Lottery__factory(signer);
	console.log("Deploying contract ...");
	contract = await contractFactory.deploy(
		'LotteryToken',
		'LT0',
		TOKEN_RATIO,
		ethers.utils.parseEther(BET_PRICE.toFixed(18)),
		ethers.utils.parseEther(BET_FEE.toFixed(18))
	);

	const deployTxReceipt = await contract.deployTransaction.wait();
	console.log(`The Lottery contract was deployed at the address ${contract.address}`);
	tokenAddress = await contract.paymentToken();
	console.log(`The Token contract was deployed at the address ${tokenAddress}`);	
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});