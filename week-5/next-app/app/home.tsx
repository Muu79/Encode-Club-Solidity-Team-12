'use client';
import React, { useEffect, useState } from 'react';

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import useSound from 'use-sound';
import style from './goldButton.module.css';
import { GiSoundOff, GiSoundOn } from 'react-icons/gi';

const Home = () => {
	const soundUrl = '/effect.wav';

	const musicUrl = '/button.mp3';

	const [play] = useSound(soundUrl, { volume: 0.1 });

	const [music, { stop }] = useSound(musicUrl, { volume: 0.25 });

	const [isHovering, setIsHovering] = React.useState(false);
	const [isSilent, setIsSilent] = useState(true);

	const [count, setCount] = useState(new Date().getTime() + 3600 * 1000 + 5000);
	// TODO: fetch timestamp(betsClosingTime) from lottery smartcontract
	// setCount(betsClosingTime-now)

	useEffect(() => {
		if (isSilent) {
			stop();
		} else {
			music();
		}
	}, [isSilent]);

	return (
		<div>
			<div>
				<FlipClockCountdown
					className='flip-clock'
					to={count}
					separatorStyle={{ color: 'black', size: '6px' }}
					labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
					renderMap={[false, true, true, true]}
				/>
			</div>
			<button
				onClick={() => {
					setIsSilent(!isSilent);
				}}
			>
				{isSilent ? <GiSoundOff size={30} /> : <GiSoundOn size={30} />}
			</button>

			<button
				onMouseEnter={() => {
					setIsHovering(true);
					play();
				}}
				onMouseLeave={() => {
					setIsHovering(false);
				}}
				onClick={() => {
					// TODO: Metamask call to purchase ticket token
				}}
				className={style.box}
			>
				Buy Ticket
			</button>
		</div>
	);
};

export default Home;
