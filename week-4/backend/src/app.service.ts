import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/Ballot.json';

dotenv.config();

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');    
  }
  
  // Ballot

  async votingPower(ballotAddress: string, address: string): Promise<object> {
    // check if parameters are valid addresses
    if (!ethers.utils.isAddress(ballotAddress))
      throw new Error(
        `Parameter Error: Token contract address ${ballotAddress} is not a valid address`,
      );
    if (!ethers.utils.isAddress(address))
      throw new Error(
        `Parameter Error: Token contract address ${address} is not a valid address`,
      );

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(
      ballotAddress,
      ballotJson.abi,
      this.provider,
    );

    // check the voting power
    const votingPowerBN = await ballotContract.votingPower(address);
    const votingPowerSpentBN = await ballotContract.votingPowerSpent(address);
    const votingPower = ethers.utils.formatEther(votingPowerBN);
    const votingPowerSpent = ethers.utils.formatEther(votingPowerSpentBN);
    console.log(votingPower, votingPowerSpent);

    return { votingPower, votingPowerSpent };
  }
}
