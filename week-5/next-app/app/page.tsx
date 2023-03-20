import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import PlaceBet from './PlaceBet';
import styles from './page.module.css';
import PurchaseTokens from './PurchaseTokens';
import BurnTokens from './BurnTokens';

export default function Home() {
	return (
		<main className={styles.main + ' w-full'}>
			<div className={styles.description}></div>

			<div className={styles.center}>
				<Image
					className={styles.logo}
					src='/Team.svg'
					alt='Team Logo'
					width={180}
					height={37}
					priority
				/>
				<div className={styles.thirteen}>
					<Image src='/twelve.svg' alt='12' width={40} height={31} priority />
				</div>
			</div>
			<p className='text-2xl mb-1'>Week-5 Project</p>
			<div className={styles.grid}>
				<div className={styles.card}>
					<PurchaseTokens />
				</div>
				<div className={styles.card}>
					<PlaceBet />
				</div>
				<div className={styles.card}>
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
