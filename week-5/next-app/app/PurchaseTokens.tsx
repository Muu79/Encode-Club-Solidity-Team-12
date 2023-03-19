'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ethers, BigNumber } from 'ethers';
import * as lotteryJson from '../utils/abi/Lottery.json';

const PurchaseTokens = () => {
	const [{ wallet }] = useConnectWallet();
	const [tokenAmount, setTokenAmount] = useState<number>(-1);
	let ethersProvider;

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
				const unsignedHash = tokenContract.purchaseTokens({ value: ethValue });

				const tx = await signer.sendTransaction({
					data: unsignedHash,
				});
				const receipt = await tx.wait();
				if (receipt.blockNumber !== undefined) {
					toast.success('Successfully purchased', {
						id: notification,
					});
				} else {
					toast.error('Something went wrong!', { id: notification });
				}
			} catch (error) {
				toast.error('Whoops... Failed to purchase!', { id: notification });
			}
		}
	}

	const handleChange = (event: {
		target: { value: SetStateAction<number> };
	}) => {
		setTokenAmount(event.target.value);
	};

	return (
		<>
			<h2 className='text-xl text-left mb-3'>Purchase Tokens</h2>
			<p>Purchase lottery tokens for ETH</p>
			<InputField
				inputType='number'
				placeholder='Amount of tokens'
				onChange={handleChange}
			/>
			<PrimaryBtn
				name='Purchase Tokens'
				onClick={() => purchaseTokens(tokenAmount)}
			/>
		</>
	);
};

export default PurchaseTokens;
