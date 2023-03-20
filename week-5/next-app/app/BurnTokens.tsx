'use client';
import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as lotteryJson from '../utils/abi/Lottery.json';

const BurnTokens = () => {
	const [{ wallet }] = useConnectWallet();
	const [burnAmount, setBurnAmount] = useState<number>(-1);
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
	const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
	const lotteryAddress = process.env.LOTTERY_CONTRACT as string;

	useEffect(() => {
		if (!wallet || !wallet.provider) return;
		const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
		setSigner(provider.getSigner());
	}, [wallet]);

	useEffect(() => {
		setLotteryContract(
			new ethers.Contract(lotteryAddress, lotteryJson.abi, signer)
		);
	}, [signer]);

	const handleChange = (event: {
		target: { value: SetStateAction<number> };
	}) => {
		setBurnAmount(event.target.value);
	};

	const burnTokens = async () => {
		if (!signer || !lotteryContract) return;
		const notification = toast.loading(`Burning ${burnAmount} tokens`);
		try {
			const tx = await lotteryContract.returnTokens(
				parseEther('' + burnAmount)
			);
			const receipt = await tx.wait();
			if (receipt.blockNumber != undefined) {
				toast.success(`Successfully burnt ${burnAmount} tokens`, {
					id: notification,
				});
			} else {
				toast.error(`Error when burning tokens: ${receipt.message}`, {
					id: notification,
				});
			}
		} catch (err) {
			console.error(err);
			toast.error(`Error with issuing transaction`);
		}
	};

	return (
		<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border'>
			<div className='flex justify-between items-center text-white pb-2'>
				<h2>Burn Tokens</h2>
			</div>
			<div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
				<p>Tokens</p>
				<InputField
					className='flex w-full bg-transparent text-white text-right outline-none'
					inputType='number'
					placeholder='Amount of tokens'
					onChange={handleChange}
				/>
			</div>

			<PrimaryBtn
				name='Burn Tokens'
				onClick={burnTokens}
				className='transition-all ease-in duration-75 group-hover:bg-opacity-0 bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl'
			/>
		</div>
	);
};

export default BurnTokens;
