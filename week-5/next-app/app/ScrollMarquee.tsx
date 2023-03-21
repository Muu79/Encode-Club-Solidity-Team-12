'use client';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { SetStateAction, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import * as lotteryJson from '../utils/abi/Lottery.json';

export default function ScrollMarquee() {
	const [{ wallet }] = useConnectWallet();
	const contractAddress: string = process.env.LOTTERY_CONTRACT as string;
	const [winnings, setWinnings] = useState(0);
	useEffect(() => {
		if (wallet) {
			const address = wallet.accounts[0].address;
			const contract = new ethers.Contract(contractAddress, lotteryJson.abi);
			contract
				.prize(address)
				.then((value: SetStateAction<number>) => setWinnings(value));
		}
	}, [wallet]);

	return (
		<Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>
			<div className='flex space-x-2 mx-10'>
				<h4 className='text-[#FFD700] font-bold'>Make a bet and Win big</h4>
				<p className='text-white font-md italic'>
					Your Winnings: {winnings} ETH
				</p>
			</div>
		</Marquee>
	);
}
