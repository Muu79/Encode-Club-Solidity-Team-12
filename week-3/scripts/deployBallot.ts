
import { isValidAddress } from "@nomicfoundation/ethereumjs-util";
import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import { fallbackProvider, convertStringArrayToBytes32, isPrivateKey } from "./utils"
require("dotenv").config();


async function main() {
    //getting CLI arguments
    const tokenAddress = process.argv[2];
    if(!tokenAddress) {
        throw new Error(`Parameter Error: Missing first parameter, Token Contract Address`)
    }else if (!isValidAddress(tokenAddress)){
        throw new Error(`Parameter Error: Token contract address: ${tokenAddress} is not a valid address`)
    }

    const proposals = process.argv.slice(3);
    if(!proposals|| proposals.length < 2){
        throw new Error(`Parameter Error: Please enter at least two proposal after the token address`)
    }

    //getting hardhat and ethers related variables
    const parsedProposals = convertStringArrayToBytes32(proposals);
    const provider = await fallbackProvider();
    const currentBlock = await provider.getBlockNumber();
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey){
        throw new Error(`Environment Error: Please make sure your .env file contains a private key`);
    }else if(!isPrivateKey(privateKey)){
        throw new Error(`Environment Error: Please make sure your private key in your .env file is a valid private key `)
    }
    const userWallet = new ethers.Wallet(privateKey, provider);
    const userSigner = userWallet.connect(provider);
    const ballotFactory = new Ballot__factory(userSigner);

    //deploying contract
    const ballotContract = await ballotFactory.deploy(parsedProposals, tokenAddress, currentBlock);
    const deployReceipt = await ballotContract.deployTransaction.wait();
    console.log(
        `Ballot Contract deployed @ ${ballotContract.address}
        with proposals: ${proposals.map((prop, i) => `\n${i}\t${prop}`)}`
    );


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})