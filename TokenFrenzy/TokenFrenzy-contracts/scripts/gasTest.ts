import { ethers } from "hardhat";
import { TokenFrenzy__factory } from "../typechain-types";

async function main() {
	const lotteryFactory = await ethers.getContractFactory("TokenFrenzy");
	let contract = await lotteryFactory.deploy();
	contract = await contract.deployed();
    const deployTxReceipt = await contract.deployTransaction.wait();
	console.log(`Use ${deployTxReceipt.gasUsed} gas`);	
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
