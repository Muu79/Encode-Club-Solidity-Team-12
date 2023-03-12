import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { BigNumber, ethers } from "ethers";
import * as tokenJson from "./assets/MyToken.json";
import * as ballotJson from "./assets/Ballot.json";

dotenv.config();

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider("goerli");
    this.tokenContract = new ethers.Contract(process.env.TOKEN_CONTRACT_ADDRESS, tokenJson.abi, this.provider);
  }

  // Ballot

  async votingPower(ballotAddress: string, address: string): Promise<object> {
    // check if parameters are valid addresses
    if (!ethers.utils.isAddress(ballotAddress)) throw new Error(`Parameter Error: Token contract address ${ballotAddress} is not a valid address`);
    if (!ethers.utils.isAddress(address)) throw new Error(`Parameter Error: Token contract address ${address} is not a valid address`);

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(ballotAddress, ballotJson.abi, this.provider);

    // check the voting power
    const votingPowerBN = await ballotContract.votingPower(address);
    const votingPowerSpentBN = await ballotContract.votingPowerSpent(address);
    const votingPower = ethers.utils.formatEther(votingPowerBN);
    const votingPowerSpent = ethers.utils.formatEther(votingPowerSpentBN);

    return { votingPower, votingPowerSpent };
  }

  async winningProposal(ballotAddress: string): Promise<object> {
    // check if parameter is a valid address
    if (!ethers.utils.isAddress(ballotAddress)) throw new Error(`Parameter Error: Token contract address ${ballotAddress} is not a valid address`);

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(ballotAddress, ballotJson.abi, this.provider);

    // querying result
    const winnerProposalIndexBN = await ballotContract.winningProposal();
    const winnerProposalName = ethers.utils.parseBytes32String((await ballotContract.proposals(winnerProposalIndexBN)).name);
    const winnerVotecount = ethers.utils.formatEther((await ballotContract.proposals(winnerProposalIndexBN))?.voteCount);

    if (winnerVotecount === ethers.utils.formatEther(0)) {
      throw new Error("No vote has been casted yet");
    }

    const winnerProposalIndex = parseFloat(winnerProposalIndexBN);

    console.log(winnerProposalName);
    return {
      winnerProposalIndex: winnerProposalIndex,
      winnerProposalName: winnerProposalName,
      winnerVotecount: winnerVotecount,
    };
  }

  async castVote(ballotAddress: string, proposal: number, amount: string): Promise<string> {
    // check if parameter is a valid address
    if (!ethers.utils.isAddress(ballotAddress)) throw new Error(`Parameter Error: Token contract address ${ballotAddress} is not a valid address`);

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(ballotAddress, ballotJson.abi, this.provider);

    // connecting to wallet nad getting signer
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);

    // voting
    const voteTx = await ballotContract.connect(signer).vote(proposal, ethers.utils.parseEther(amount));
    const txReceipt = await voteTx.wait();
    return txReceipt;
  }

  // Token

  async mint(to: string, amount: string) {
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const signer = wallet.connect(this.provider);
    const tx = await this.tokenContract.connect(signer).mint(to, ethers.utils.parseEther(amount));
    const txReceipt = await tx.wait();
    return txReceipt.status == 1 ? "Completed" : "Reverted";
  }
}
