import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types/factories/Ballot__factory";
dotenv.config();

async function main() {
  // require at least 2 arguments. First represents the contract address and the second the address to receive vote right
  // can give more than 2 arguments. "contractAddress" "voter1" "voter2"..."votern"
  const args = process.argv.slice(2);
  const contractAddress = args[0];
  const voters = args.slice(1);
  console.log(args, voters);

  // check if the arguments are valid addresses
  if (!ethers.utils.isAddress(contractAddress)) throw new Error(`${contractAddress} not a valid address!`);
  voters.forEach((el) => {
    if (!ethers.utils.isAddress(el)) throw new Error(`${el} not a valid address!`);
  });

  // connecting to provider and wallet
  const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Private key");
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  console.log(`Connected to the wallet address ${wallet.address}`);

  // initialising the contract
  const ballotContractFactory = new Ballot__factory(signer);
  const contract = ballotContractFactory.attach(contractAddress);

  // giving vote right
  console.log(`Connected to contract ${contractAddress}`);

  // calling giveRightToVote on contract
  for (let i = 0; i < voters.length; i++) {
    console.log(`Giving right to vote to ${voters[i]} . Address ${i + 1}/${voters.length}`);
    const voteRight = await contract.giveRightToVote(voters[i]);
    const txReceipt = await voteRight.wait();
    console.log(txReceipt);
    console.log(`${voters[i]} . Address ${i + 1}/${voters.length} received vote right!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
