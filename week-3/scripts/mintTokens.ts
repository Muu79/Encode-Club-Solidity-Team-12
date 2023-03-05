import { parseEther } from "@ethersproject/units";
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types"
import { fallbackProvider } from "./utils"
require("dotenv").config();


async function main (){

    const tokenAddress = process.argv[2];
    const addressTo = process.argv[3];
    const mintAmount = parseEther(process.argv[4]);

    const provider = await fallbackProvider();
    const privateKey = process.env.PRIVATE_KEY;
    const userWallet = new ethers.Wallet(privateKey);
    const user = userWallet.connect(provider);
    const tokenFactory = new MyToken__factory();
    const token =  tokenFactory.attach(tokenAddress);

    token.connect(user).mint(addressTo, mintAmount);
    
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})