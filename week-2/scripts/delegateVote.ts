import { ethers } from "hardhat";

const ballotABI = require("../contracts/Ballot.json")

require("dotenv").config();

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function delegateVote() {
    const delegateAddress = process.argv[2];
    const contractAddress:any = process.env.CONTRACT_ADDRESS;
    if(!contractAddress) throw new Error("Missing environment: Contract Address")
    if(!delegateAddress) throw new Error("Missing parameters: Address to delegate vote to")
        
    //dev wallet setup
    /*
    const signer = (await ethers.getSigners())[0]
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballContractFactory.deploy(convertStringArrayToBytes32(["test1", "test2"]));
    */

    //test-net wallet setup
    const provider = new ethers.providers.InfuraProvider("goerli",process.env.INFURA_API_KEY);
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private Key");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    const signer = wallet.connect(provider);
    const ballotContract = new ethers.Contract(contractAddress, ballotABI, signer);
    
    
    const canDelegateVote = (await ballotContract.voters(delegateAddress))[1];
    if(!canDelegateVote) throw new Error("Contract error: Delegate address doesn't have the right to vote")
    const tx = await ballotContract.connect(signer).delegate(delegateAddress);
    console.log(tx);
}

delegateVote().catch(error=>{
    console.log(error);
    process.exitCode = 1;
});
