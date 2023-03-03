
import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import { fallbackProvider, convertStringArrayToBytes32 } from "./utils"
require("dotenv").config();


async function main() {
    //getting CLI arguments
    const tokenAddress = process.argv[2];
    const proposals = process.argv.slice(3);

    //getting hardhat and ethers related variables
    const parsedProposals = convertStringArrayToBytes32(proposals);
    const providor = fallbackProvider();
    const currentBlock = await providor.getBlockNumber();
    const privateKey = process.env.PRIVATE_KEY;
    const userWallet = new ethers.Wallet(privateKey, providor);
    const userSigner = userWallet.connect(providor);
    const ballotFactory = new Ballot__factory(userSigner);

    //deploying contract
    const ballotContract = await ballotFactory.deploy(parsedProposals, tokenAddress, currentBlock);
    const deployReciept = await ballotContract.deployTransaction.wait();
    console.log(
        `Ballot Contract deployed @ ${ballotContract.address}
        with proposals: ${proposals.map((prop, i) => `\n${i}\t${prop}`)}`
    );


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})