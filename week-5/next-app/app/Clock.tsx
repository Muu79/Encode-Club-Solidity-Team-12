'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { ethers } from 'ethers';
import * as lotteryJson from '../utils/abi/Lottery.json';
import { useConnectWallet } from '@web3-onboard/react';

const Clock = () => {
	let lotteryAddress = process.env.LOTTERY_CONTRACT as string;
	const [{ wallet }] = useConnectWallet();

	const [count, setCount] = useState(new Date().getTime() + 3600 * 1000 + 5000);
	async function counter() {
		if (wallet) {
			const signer = new ethers.providers.Web3Provider(
				wallet.provider,
				'any'
			).getSigner();
			const lotteryContract = new ethers.Contract(
				lotteryAddress,
				lotteryJson.abi,
				signer
			);
			const end = (await lotteryContract.betsClosingTime()).toNumber();
			console.log('end: ', end);
			if (end <= Date.now()) {
				setCount(0);
			} else {
				setCount(end - Date.now());
			}
		}
	}

	useEffect(() => {
		if (!wallet) {
			return;
		}
		counter();
	}, [wallet]);

	return (
		<div>
			<div>
				<FlipClockCountdown
					className='flip-clock'
					to={count}
					separatorStyle={{ color: 'white', size: '6px' }}
					labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
					labelStyle={{ color: 'white' }}
					renderMap={[false, true, true, true]}
				>
					<p className='animate-pulse'>This Draw has ended</p>
					<Image
						className='w-full h-full'
						src='/zero.png'
						alt='Finished Countdown'
						width={180}
						height={37}
						priority
					/>
					{/* Some action after countdown Ends. */}
				</FlipClockCountdown>
			</div>
		</div>
	);
};

export default Clock;
