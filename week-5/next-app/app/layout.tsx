import Sidebar from '@/components/Sidebar';
import ClientProvider from './ClientProvider';
import './globals.css';
import Header from './Header';
import ThreePage from './ThreePage';

export const metadata = {
	title: {
		default: 'Lottery Dapp',
		template: '%s | Lottery Dapp',
	},
	description: 'Team-12 app for week-5 assignment',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<div>
					<Header />
					<div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
						<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border'>
							<h1 className='text-5xl text-center font-semibold text-white'>
								Next Draw
							</h1>
							<div className='flex justify-between p-2 space-x-2'>
								<div className='stats bg-[#091F1C] text-white p-4 flex-1 rounded-md border-2 border-[#004337]'>
									<h2 className='text-sm'>Total Pool</h2>
									{/* Price pool from onchain data */}
									<p>0.1 ETH</p>
								</div>
								{/* <div className='bg-[#091F1C] text-white p-4 flex-1 rounded-md border-2 border-[#004337]'>
								<h2 className='text-sm'>Tickets Remaining</h2>
								<p className='text-xl'>100</p>
							</div> */}
							</div>
							{/* Countdown timer */}
						</div>
						<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border space-y-2'>
							<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border'>
								<div className='flex justify-between items-center text-white pb-2'>
									<h2>Price per ticket</h2>
									<p>0.001 ETH</p>
								</div>
								<div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
									<p>Tickets</p>
									<input
										type='number'
										className='flex w-full bg-transparent text-right outline-none'
										min={1}
										max={10}
									/>
								</div>
								<button className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl'>
									Buy tickets
								</button>
							</div>
						</div>

						<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border space-y-2'>
							<div className='bg-[#091F1C] p-5 rounded-lg border-[#004337] border'>
								<div className='flex justify-between items-center text-white pb-2'>
									<h2>Burn Tokens</h2>
								</div>
								<div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
									<p>Tokens</p>
									<input
										type='number'
										className='flex w-full bg-transparent text-right outline-none'
										min={1}
										max={10}
									/>
								</div>
								<button className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl'>
									Burn token
								</button>
							</div>
						</div>
					</div>

					<div></div>
				</div>
				{/* <ThreePage> */}
				{/* <Sidebar /> */}
				{/* <ClientProvider children={children} /> */}
				{/* </ThreePage> */}
			</body>
		</html>
	);
}
