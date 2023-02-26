import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
import { fallbackProvider } from "./utils";
dotenv.config();

async function main() {
    // getting arguments: ballot contract address and proposal index (from 0 to 2)
    const args = process.argv.slice(2);
    const contractAddress = args[0];
    const proposal = args[1];

    if (!ethers.utils.isAddress(contractAddress)) throw new Error("Not a valid address!");

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private key");
    const wallet = new ethers.Wallet(privateKey);
    
    // connecting to provider and getting wallet
    const provider = fallbackProvider();
    const signer = wallet.connect(provider);
    console.log(`Connected to wallet address ${wallet.address}`);

    // connecting to ballot contract
    const ballotContractFactory = new Ballot__factory(signer);
    const contract = ballotContractFactory.attach(contractAddress);
    console.log(`Connected to contract address ${contractAddress}`);

    // voting
    console.log("Voting in progress ...");
    const vote = await contract.connect(signer).vote(proposal);
    const voteTx = await vote.wait();
    console.log(voteTx);
    console.log(`${wallet.address} has voted`);

}   

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});