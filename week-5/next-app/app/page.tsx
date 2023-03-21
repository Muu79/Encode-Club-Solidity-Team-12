import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import PlaceBet from './PlaceBet';
import styles from './page.module.css';
import PurchaseTokens from './PurchaseTokens';
import BurnTokens from './BurnTokens';
import Clock from './Clock';
import Header from './Header';
import PrizePool from './PrizePool';
import ScrollMarquee from './ScrollMarquee';
import Winner from './Winner';
import Manager from './Manager';

export default function Home() {
	return (
		<main>
			<Header />
			<ScrollMarquee />
			<Winner />
			<Manager />
			<div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
				<div className='bg-[#091F1C]/40 p-5 rounded-lg border-[#004337] border'>
					<h1 className='text-5xl text-center font-semibold text-white'>
						Next Draw
					</h1>
					<div className='flex justify-between p-2 space-x-2'>
						<div className='stats bg-[#091F1C] text-white p-4 flex-1 rounded-md border-2 border-[#004337]'>
							<h2 className='text-sm'>Total Pool</h2>
							{/* Price pool from onchain data */}
							<PrizePool />
						</div>
						<div className='bg-[#091F1C] text-white p-4 flex-1 rounded-md border-2 border-[#004337]'>
							<h2 className='text-sm'>Your tickets</h2>
							<p className='text-xl'>10</p>
						</div>
					</div>
					<Clock />
				</div>
				<div className='bg-[#091F1C]/40 p-5 rounded-lg border-[#004337] border space-y-2'>
					{/* Purchase tokens */}
					<PurchaseTokens />
				</div>

				<div className='bg-[#091F1C]/40 p-5 rounded-lg border-[#004337] border space-y-2'>
					<BurnTokens />
				</div>
			</div>

			<div className='absolute bottom-0 right-0 mr-8 mb-8'>
				<a
					href='https://github.com/Muu79/Encode-Club-Solidity-Team-12/tree/main/week-5'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaGithub size={25} className='' />
				</a>
			</div>
		</main>
	);
}
