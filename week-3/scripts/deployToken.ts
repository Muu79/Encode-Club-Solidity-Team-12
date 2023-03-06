import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types"
import { fallbackProvider } from "./utils"
require("dotenv").config();


async function main (){

    const tokenName = process.argv[2];
    const tokenSymbol = process.argv[3];

    const provider = await fallbackProvider();
    const privateKey = process.env.PRIVATE_KEY;
    const userWallet = new ethers.Wallet(privateKey);
    const user = userWallet.connect(provider);
    const tokenFactory = new MyToken__factory(user);
    const token = await tokenFactory.deploy(tokenName, tokenSymbol);

    console.log(`Token: ${await token.name()} (${await token.symbol()})\ndeployed at address: ${token.address}`);
    
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})