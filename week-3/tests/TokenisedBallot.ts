import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot, MyToken } from '../typechain-types';

const PROPOSALS = ['chocolate', 'mint', 'lemon', 'coconut'];
const MINT_VALUE = ethers.utils.parseEther('10');

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe('Tokenised Ballot', async () => {
  let ballotContract: Ballot;
  let myTokenContract: MyToken;
  let tokenAddress: string;
  let targetBlockNumber: number;
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    // deploy ERC20Votes token
    const myTokenFactory = await ethers.getContractFactory('MyToken');
    myTokenContract = await myTokenFactory.deploy();
    await myTokenContract.deployTransaction.wait();
    // mint ERC20Votes
    await myTokenContract.mint(signers[1].address, MINT_VALUE);
    await myTokenContract.mint(signers[2].address, MINT_VALUE);
    // self Delegate
    await myTokenContract.connect(signers[1]).delegate(signers[1].address);
    await myTokenContract.connect(signers[2]).delegate(signers[2].address);

    // deploy TokenisedBallot
    tokenAddress = myTokenContract.address;
    targetBlockNumber = await ethers.provider.getBlockNumber();
    const ballotContractFactory = await ethers.getContractFactory('Ballot');
    ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
      tokenAddress,
      targetBlockNumber
    );
    await ballotContract.deployTransaction.wait();
  });

  describe('When the Ballot contract is deployed', async () => {
    it('Has the provided proposals', async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });
    it('Has zero votes for all proposals', async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it('has correct blockNumber', async () => {
      const currentBlockNumber = await ethers.provider.getBlockNumber();
      expect(currentBlockNumber).to.greaterThanOrEqual(targetBlockNumber);
    });

    it('has correct tokenAddress', async () => {
      const savedTokenAddress = await ballotContract.tokenContract();
      expect(savedTokenAddress).to.eq(tokenAddress);
    });
  });

  describe('When a user votes', async () => {
    beforeEach(async () => {});
  });
});
