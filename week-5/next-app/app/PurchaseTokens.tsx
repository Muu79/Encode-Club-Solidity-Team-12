'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ethers, BigNumber } from 'ethers';
import * as lotteryJson from '../utils/abi/Lottery.json';
import * as lotteryTokenJson from '../utils/abi/LotteryToken.json';
import { parseEther, formatEther } from 'ethers/lib/utils';

const PurchaseTokens = () => {
	const [{ wallet }] = useConnectWallet();
	const [tokenAmount, setTokenAmount] = useState<number>(-1);
	const [totalTicketPrice, setTotalTicketPrice] = useState(0.0012);
	const [betAmount, setBetAmount] = useState<number>(-1);
	const [betFee, setBetFee] = useState<BigNumber>();
	const [tokenContract, setTokenContract] = useState<ethers.Contract>();
	const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
	let ethersProvider,
		tokenAddress = process.env.TOKEN_CONTRACT as string,
		lotteryAddress = process.env.LOTTERY_CONTRACT as string;

	useEffect(() => {
		if (!signer) return;
		setTokenContract(
			new ethers.Contract(tokenAddress, lotteryTokenJson.abi, signer)
		);
		setLotteryContract(
			new ethers.Contract(lotteryAddress, lotteryJson.abi, signer)
		);
	}, [signer]);

	useEffect(() => {
		if (!wallet || !lotteryContract) return;
		else {
			getFee().then((value) => {
				setBetFee(value);
			});
		}
	}, [lotteryContract]);

	useEffect(() => {
		if (!wallet) {
			return;
		}
		ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');
		setSigner(ethersProvider.getSigner());
		console.log('signer ', signer);
	}, [wallet]);

	const getFee = async () => {
		if (!lotteryContract) return;
		const total = (await lotteryContract.betFee()).add(
			await lotteryContract.betPrice()
		);
		return Promise.resolve(total);
	};

	const createAllowance = async () => {
		if (!tokenContract || !lotteryAddress || !signer || !betFee) return;
		const allowance = await tokenContract
			.connect(signer)
			.approve(lotteryAddress, parseEther('1000'));
		await allowance.wait();
	};

	async function betTokens(amount: number) {
		if (!lotteryContract || !tokenContract || !signer || !betFee) return;
		amount = Math.abs(amount);
		const allowance = await tokenContract
			.connect(signer)
			.allowance(wallet?.accounts[0].address, lotteryAddress);
		console.log(allowance.toString(), betFee.mul(amount).toString());

		if (betFee.mul(amount).gte(allowance)) await createAllowance();
		if (wallet && amount > 0) {
			const address = wallet.accounts[0].address;
			const notification = toast.loading(
				`Betting ${amount} time${amount > 1 ? 's' : ''} for ${address.substring(
					0,
					6
				)}`
			);
			try {
				const userTokenBal: BigNumber = await tokenContract.balanceOf(
					wallet.accounts[0].address
				);
				if (betFee && userTokenBal >= betFee.mul(amount)) {
					const tx = await lotteryContract.betMany(amount);
					const receipt = await tx.wait();
					if (receipt.blockNumber !== undefined) {
						toast.success(
							`Successfully bet ${amount} time${amount > 1 ? 's' : ''}`,
							{ id: notification }
						);
					} else {
						console.log(receipt);

						toast.error('Something went wrong!\n' + `${receipt.reason}`, {
							id: notification,
						});
					}
				}
			} catch (error) {
				console.error(error);
				toast.error(`Whoops... Failed to purchase!\n`, { id: notification });
			}
		}
	}

	async function purchaseTokens(amount: number) {
		if (wallet && tokenAmount > 0) {
			const address = wallet.accounts[0].address;
			const notification = toast.loading(
				`Purchasing ${amount} for ${address.substring(0, 6)}`
			);
			try {
				ethersProvider = new ethers.providers.Web3Provider(
					wallet.provider,
					'any'
				);
				const signer = ethersProvider.getSigner();
				console.log('signer ', signer);
				const contractAddress: string = process.env.LOTTERY_CONTRACT as string;

				const tokenContract = new ethers.Contract(
					contractAddress,
					lotteryJson.abi,
					signer
				);
				const ethValue = ethers.utils
					.parseEther(amount.toString())
					.div(BigNumber.from(process.env.TOKEN_RATIO));
				//const tx = await tokenContract.connect(signer).purchaseTokens({
				//	value: ethValue,
				//});
				const tx = await tokenContract
					.connect(signer)
					.purchaseTokens({ value: ethValue });
				const receipt = await tx.wait();
				if (receipt.blockNumber !== undefined) {
					toast.success('Successfully purchased', {
						id: notification,
					});
				} else {
					toast.error('Something went wrong!', { id: notification });
				}
			} catch (error) {
				console.error(error);
				toast.error('Whoops... Failed to purchase!', { id: notification });
			}
		}
	}

	async function buyTickets(amount: number) {
		await purchaseTokens(tokenAmount);
		await betTokens(betAmount);
	}

	const handleChange = (event: {
		target: { value: SetStateAction<number> };
	}) => {
		setTokenAmount(event.target.value);
		setBetAmount(event.target.value);
	};

	return (
		<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border'>
			<div className='flex justify-between items-center text-white pb-2'>
				<h2>Price per ticket</h2>
				<p>0.001 ETH</p>
			</div>
			<div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
				<p>Tickets</p>
				<InputField
					className='flex w-full bg-transparent text-white text-right outline-none'
					inputType='number'
					placeholder='Amount of tokens'
					onChange={handleChange}
				/>
			</div>
			<div className='space-y-2 mt-5'>
				<div className='flex items-center justify-between text-emerald-300 text-sm italic font-extralight'>
					<p>Total cost of tickets</p>
					<p>{totalTicketPrice} ETH</p>
				</div>
				<div className='flex items-center justify-between text-emerald-300 text-xs italic'>
					<p>Service charge</p>
					{/* <p>{Number(betFee)} ETH</p> */}
					<p>{Number(totalTicketPrice - 0.001).toFixed(4)} ETH</p>
				</div>
			</div>
			<PrimaryBtn
				className='transition-all ease-in duration-75 group-hover:bg-opacity-0 bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl'
				name='Buy ticket'
				onClick={() => purchaseTokens(tokenAmount)}
			/>
		</div>
	);
};

export default PurchaseTokens;
