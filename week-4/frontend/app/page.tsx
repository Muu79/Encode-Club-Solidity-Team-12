import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import CastVote from './CastVote';
import Connect from './Connect';
import Delegate from './Delegate';
import Mint from './Mint';
import styles from './page.module.css';

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p className='mb-2 flex flex-row justify-center space-x-4 md:mb-0 '>
					<span>Built with </span>
					<a
						className='underline hover:text-neutral-600'
						href='https://beta.nextjs.org/'
						target='_blank'
						rel='noreferrer'
					>
						<code className={styles.code}>Next.js</code>
					</a>
					,
					<a
						className='underline hover:text-neutral-600'
						href='https://docs.nestjs.com/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<code className={styles.code}>NestJs</code>
					</a>
					,
					<a
						className='underline hover:text-neutral-600'
						href='https://tailwindcss.com'
						target='_blank'
						rel='noopener noreferrer'
					>
						<code className={styles.code}>Tailwind Css</code>
					</a>
					,
					<a
						className='underline hover:text-neutral-600'
						href='https://www.typescriptlang.org/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<code className={styles.code}>Typescript</code>
					</a>
				</p>
				<Connect />
			</div>

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
			<p className='text-2xl mb-1'>Week-4 Project</p>

			<div className={styles.grid}>
				<div className={styles.card}>
					<Mint />
				</div>

				<div className={styles.card}>
					<CastVote />
				</div>

				<div className={styles.card}>
					<Delegate />
				</div>
			</div>
			<div className='absolute bottom-0 right-0 mr-8 mb-8'>
				<a
					href='https://github.com/Muu79/Encode-Club-Solidity-Team-12/tree/main/week-4'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaGithub size={25} className='' />
				</a>
			</div>
		</main>
	);
}
