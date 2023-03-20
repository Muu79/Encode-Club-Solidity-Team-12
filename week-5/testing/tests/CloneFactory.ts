import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
	LotteryClone,
	LotteryCloneFactory,
} from "../typechain-types/contracts/CloneFactory";

const TOKEN_NAME = "TestToken";
const TOKEN_SYMBOL = "TST";
const PURCHASE_RATIO = 100;
const BET_PRICE = 15;
const BET_FEE = 10;
const DURATION = 86400;
const PURCHASE_TOKEN = 1;

describe("Clone Factory", async () => {
	let lotteryContract: LotteryClone;
	let cloneFactoryContract: LotteryCloneFactory;
	let signers: SignerWithAddress[];
	let deployLotteryInstance: any;
	let lotteryInstanceContract: LotteryClone;

	beforeEach(async () => {
		// deploy Lottery contract
		const lotteryContractFactory = await ethers.getContractFactory(
			"LotteryClone"
		);
		lotteryContract = await lotteryContractFactory.deploy();
		await lotteryContract.deployTransaction.wait();

		// deploy Lottery Clone Factory
		const lotteryCloneFactory = await ethers.getContractFactory(
			"LotteryCloneFactory"
		);
		cloneFactoryContract = await lotteryCloneFactory.deploy(
			lotteryContract.address
		);
		await cloneFactoryContract.deployTransaction.wait();

		// get signers
		signers = await ethers.getSigners();

		// deploy instance of Lottery contract from Clone Factory contract
		deployLotteryInstance = await cloneFactoryContract.createLottery(
			TOKEN_NAME,
			TOKEN_SYMBOL,
			PURCHASE_RATIO,
			ethers.utils.parseEther(BET_PRICE.toFixed(18)),
			ethers.utils.parseEther(BET_FEE.toFixed(18))
		);
		await deployLotteryInstance.wait();

		const lotterys = await cloneFactoryContract.getLottery();
		lotteryInstanceContract = lotteryContractFactory.attach(
			lotterys[lotterys.length - 1]
		);
	});

	describe("When a new instance of Lottery is deployed", async () => {
		it("Has the correct owner", async function () {
			expect(await lotteryInstanceContract.owner()).to.eq(signers[0].address);
		});

		it("Has the correct purchase ratio", async () => {
			expect(await lotteryInstanceContract.purchaseRatio()).to.eq(
				PURCHASE_RATIO
			);
		});

		it("Has the correct bet price", async () => {
			expect(await lotteryInstanceContract.betPrice()).to.eq(
				ethers.utils.parseEther(BET_PRICE.toFixed(18))
			);
		});

		it("Has the correct bet fee", async () => {
			expect(await lotteryInstanceContract.betFee()).to.eq(
				ethers.utils.parseEther(BET_FEE.toFixed(18))
			);
		});

		it("Bets are closed", async () => {
			expect(await lotteryInstanceContract.betsOpen()).to.eq(false);
		});
	});

	describe("When the owner open bets", async () => {
		beforeEach(async () => {
			const currentBlock = await ethers.provider.getBlock("latest");
			console.log(
				`${signers[0].address}  ${await lotteryInstanceContract.owner()}`
			);
			const tx = await lotteryContract.openBets(
				currentBlock.timestamp + Number(DURATION)
			);
			await tx.wait();
			console.log(tx);
		});

		// TODO reverts with reason 'Caller is not the owner'
		it("Bets are open", async () => {
			expect(
				await lotteryInstanceContract.connect(signers[0]).betsOpen()
			).to.eq(true);
		});
	});
});
