import Image from 'next/image';
import styles from './page.module.css';
import { BiMenuAltRight } from 'react-icons/bi';
import Sounds from './Sounds';
import { GiRollingDices } from 'react-icons/gi';

export default function Header() {
	return (
		<header className='grid gird-cols-2 md:grid-cols-5 justify-between items-center p-5'>
			<div className='flex flex-row items-center justify-center mb-10'>
				<GiRollingDices size={60} className={'-mb-2'} />
				<h1 className='hidden md:inline text-center text-3xl mt-2'>Lottery</h1>
				<h2 className='hidden md:inline text-center text-xs italic'>Dapp</h2>
			</div>
			{/* <div className='flex items-center space-x-2'>
				<Image
					className={styles.logo}
					src='/Team.svg'
					alt='Team Logo'
					width={60}
					height={20}
					priority
				/>
				<div className={styles.thirteen}>
					<Image src='/twelve.svg' alt='12' width={20} height={10} priority />
				</div>
			</div> */}

			<div className='hidden md:flex md:col-span-3 items-center justify-center rounded-md'>
				<div className='bg-transparent'>
					{/* <button className={`bg-[#036756] text-white py-2 px-2 rounded`}>
						Buy Ticket
					</button> */}
					<Sounds />
				</div>
			</div>

			<div className='flex flex-col ml-auto text-right'>
				{/* <BiMenuAltRight size={25} /> */}
				<span className='md:hidden'>Connect</span>
			</div>
		</header>
	);
}
