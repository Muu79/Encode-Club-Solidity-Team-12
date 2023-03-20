'use client';
import { useEffect, useState } from 'react';

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
			if (end > Date.now()) {
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
					separatorStyle={{ color: 'black', size: '6px' }}
					labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
					labelStyle={{ color: 'black' }}
					renderMap={[false, true, true, true]}
				>
					{/* Some action after countdown Ends. */}
				</FlipClockCountdown>
			</div>
		</div>
	);
};

export default Clock;
