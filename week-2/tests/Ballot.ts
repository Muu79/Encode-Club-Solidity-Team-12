import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const proposals: string[] = ["proposal1", "proposal2"];
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(PROPOSALS));
    await ballotContract.deployTransaction.wait();
  });

  describe("When the contract is deployed", async function () {
    it("Has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[index]);
      }
    });

    it("Sets the deployer address as chairperson", async function () {
      const signers = await ethers.getSigners();
      const deployer = signers[0].address;
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.equal(deployer);
    });

    it("Has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairperson = await ballotContract.chairperson();
      const chairpersonVoter = await ballotContract.voters(chairperson);
      const votingWeight = chairpersonVoter.weight;
      expect(votingWeight).to.equal(1);
    });
  });

  describe("When the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const accounts = await ethers.getSigners();
      const voter = accounts[1];
      await ballotContract.giveRightToVote(voter.address);
      expect((await ballotContract.voters(voter.address)).weight).to.equal(1);
    });

    it("Can not give right to vote for someone that has voted", async function () {
      const accounts = await ethers.getSigners();
      const voter = accounts[1];
      await ballotContract.giveRightToVote(voter.address);
      await ballotContract.connect(voter).vote(1);
      await expect(ballotContract.giveRightToVote(voter.address)).to.be.rejectedWith("The voter already voted.");
    });

    it("Can not give right to vote for someone that has already voting rights", async function () {
      const accounts = await ethers.getSigners();
      const voter = accounts[1];
      await ballotContract.giveRightToVote(voter.address);
      await expect(ballotContract.giveRightToVote(voter.address)).to.be.reverted;
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    it("should register the vote", async function () {
      const accounts = await ethers.getSigners();
      const voter = accounts[1];
      await ballotContract.giveRightToVote(voter.address);
      await ballotContract.connect(voter).vote(0);
      const proposal = await ballotContract.proposals(0);

      expect(proposal.voteCount).to.equal(1);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    it("should transfer voting power", async function () {
      const accounts = await ethers.getSigners();
      const voter = accounts[1];
      const delegate = accounts[2];

      await ballotContract.giveRightToVote(voter.address);
      await ballotContract.giveRightToVote(delegate.address);
      await ballotContract.connect(voter).delegate(delegate.address);

      expect((await ballotContract.voters(voter.address)).delegate).to.equal(delegate.address);
    });
  });

  describe("when an attacker interact with the giveRightToVote function in the contract", function () {
    it("should revert", async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const voter = accounts[2];
      await expect(ballotContract.connect(attacker).giveRightToVote(voter.address)).to.be.revertedWith("Only chairperson can give right to vote.");
    });
  });

  describe("when an attacker interact with the vote function in the contract", function () {
    it("should revert", async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      await expect(ballotContract.connect(attacker).vote(1)).to.be.rejectedWith("Has no right to vote");
    });
  });

  describe("when an attacker interact with the delegate function in the contract", function () {
    it("should revert", async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const voter = accounts[2];
      await expect(ballotContract.connect(attacker).delegate(voter.address)).to.be.rejectedWith("You have no right to vote");
    });
  });

  describe("when someone interact with the winningProposal function before votes are cast", function () {
    it("should return 0", async function () {
      const accounts = await ethers.getSigners();
      const randomAccount = accounts[1];

      expect(await ballotContract.connect(randomAccount).winningProposal()).to.equal(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    it("should return 0", async function () {
      const accounts = await ethers.getSigners();
      const randomAccount = accounts[1];
      await ballotContract.vote(0);

      expect(await ballotContract.connect(randomAccount).winningProposal()).to.equal(0);
    });
  });

  describe("when someone interact with the winnerName function before votes are cast", function () {
    it("should return name of proposal 0", async function () {
      const accounts = await ethers.getSigners();
      const randomAccount = accounts[1];
      const winner = await ballotContract.connect(randomAccount).winnerName();

      expect(ethers.utils.parseBytes32String(winner)).to.equal("Proposal 1");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    it("should return name of proposal 0", async function () {
      const accounts = await ethers.getSigners();
      const randomAccount = accounts[1];
      await ballotContract.vote(0);
      const winner = await ballotContract.connect(randomAccount).winnerName();

      expect(ethers.utils.parseBytes32String(winner)).to.equal("Proposal 1");
    });
  });

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    it("should return the name of the winner proposal", async function () {
      const accounts = await ethers.getSigners();
      const randomAccount = accounts[1];
      const proposals = [0, 0, 0];

      for (let i = 1; i < 6; i++) {
        const voter = accounts[i];
        const vote = getRandomInt(2);
        await ballotContract.giveRightToVote(voter.address);
        await ballotContract.connect(voter).vote(vote);
        proposals[vote]++;
      }

      const contractWinner = await ballotContract.connect(randomAccount).winnerName();
      let winner = 0;

      for (let i = 0; i < 2; i++) {
        if (proposals[i + 1] > proposals[i]) winner = i + 1;
      }

      const winnerName = PROPOSALS[winner];

      expect(ethers.utils.parseBytes32String(contractWinner)).to.equal(winnerName);
    });
  });
});
