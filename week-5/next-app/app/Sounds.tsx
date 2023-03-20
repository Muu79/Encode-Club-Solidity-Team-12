'use client';
import { useEffect, useState } from 'react';
import { GiSoundOff, GiSoundOn } from 'react-icons/gi';
import style from './goldButton.module.css';
import useSound from 'use-sound';

const Sounds = async () => {
	const soundUrl = '/effect.wav';
	const musicUrl = '/button.mp3';
	const [play] = useSound(soundUrl, { volume: 0.1 });
	const [music, { stop }] = useSound(musicUrl, { volume: 0.25 });
	const [isSilent, setIsSilent] = useState(true);
	useEffect(() => {
		if (isSilent) {
			stop();
		} else {
			music();
		}
	}, [isSilent]);
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div>
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

export default Sounds;
