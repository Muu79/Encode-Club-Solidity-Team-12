import { formatEther, parseEther } from "@ethersproject/units";
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

    const mintTxReciept = await (await token.connect(user).mint(addressTo, mintAmount)).wait();
    console.log(`${formatEther(mintAmount)} of ${await token.connect(user).symbol()} Minted to address ${addressTo}`);
    

}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})