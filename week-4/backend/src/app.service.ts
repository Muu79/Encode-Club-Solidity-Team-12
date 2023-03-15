import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { BigNumber, ethers } from "ethers";
import * as tokenJson from "./assets/MyToken.json";
import * as ballotJson from "./assets/Ballot.json";

dotenv.config();
const api = process.env.ALCHEMY_API_KEY;

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;
  recentVotes = new Array<object>();

  constructor() {
    // this.provider = ethers.getDefaultProvider("goerli");
    this.provider = new ethers.providers.AlchemyProvider("goerli", api);
    this.tokenContract = new ethers.Contract(process.env.TOKEN_CONTRACT_ADDRESS, tokenJson.abi, this.provider);
    this.ballotContract = new ethers.Contract(process.env.BALLOT_CONTRACT_ADDRESS, ballotJson.abi, this.provider);

    this.ballotContract.on("voted", (_proposalName: string, _amount: BigNumber, _voteCount: BigNumber) => {
      const proposalName = ethers.utils.parseBytes32String(_proposalName);
      const amount = ethers.utils.formatEther(_amount);
      const voteCount = ethers.utils.formatEther(_voteCount);
      this.recentVotes.push({
        proposalName: proposalName,
        amountVoted: amount,
        totalVotes: voteCount,
      });
    });
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

  async getProposals(ballotAddress: string): Promise<object> {
    // check if parameter is valid address
    if (!ethers.utils.isAddress(ballotAddress)) throw new Error(`Parameter Error: Token contract address ${ballotAddress} is not a valid address`);

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(ballotAddress, ballotJson.abi, this.provider);

    let index = 0;
    let iterate = true;
    let proposals = [];

    while (iterate) {
      try {
        const proposal = await ballotContract.proposals(index);
        proposals.push({
          name: ethers.utils.parseBytes32String(proposal.name),
          votes: ethers.utils.formatEther(proposal.voteCount),
        });
      } catch (error) {
        iterate = false;
      }
      index += 1;
    }

    const targetBlockNumber = parseFloat(await ballotContract.targetBlockNumber());

    return { targetBlockNumber, proposals };
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

  getRecentVotes(): object[] {
    return this.recentVotes;
  }

  castVote(ballotAddress: string, proposal: number, amount: string): object {
    // check if parameter is a valid address
    if (!ethers.utils.isAddress(ballotAddress)) throw new Error(`Parameter Error: Token contract address ${ballotAddress} is not a valid address`);

    /* castVote with private key from .env
    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(ballotAddress, ballotJson.abi, this.provider);

    // connecting to wallet and getting signer
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);

    // voting
    const voteTx = await ballotContract.connect(signer).vote(proposal, ethers.utils.parseEther(amount));
    const txReceipt = await voteTx.wait();

    if (txReceipt.status == 1) {
      const proposalName = ethers.utils.parseBytes32String((await ballotContract.proposals(proposal)).name);
      this.recentVotes.push({ proposalIndex: proposal, proposalName: proposalName, amount: amount, txHash: txReceipt.transactionHash });
    }
    */

    // construct unsigned transaction hash
    const ballotInterface = new ethers.utils.Interface(ballotJson.abi);
    const amountBN = ethers.utils.parseEther(amount);
    const unsignedHash = ballotInterface.encodeFunctionData("vote", [proposal, amountBN]);

    return { unsignedHash: unsignedHash };
  }

  // Token

  async mint(to: string, amount: string): Promise<object> {
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const signer = wallet.connect(this.provider);
    const tx = await this.tokenContract.connect(signer).mint(to, ethers.utils.parseEther(amount));
    const txReceipt = await tx.wait();
	let res: string;
    if(txReceipt.status == 1) {
      res = "Completed"
      return {res: res}
    } 
    res= "Reverted";
    return {res: res}
  }

  delegate(to: string): object {
    const tokenInterface = new ethers.utils.Interface(tokenJson.abi);
    const unsignedHash = tokenInterface.encodeFunctionData("delegate", [to]);
    console.log(unsignedHash);
    return {unsignedHash: unsignedHash}
  }
}
