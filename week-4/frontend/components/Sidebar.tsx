'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GiVote } from 'react-icons/gi';

const Sidebar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [active, setActive] = useState(false);

	useEffect(() => {
		if (!pathname) return;
		setActive(pathname.includes('/'));

		return () => {};
	}, [pathname]);

	return (
		<div className='h-screen p-2 md:p-10 py-6 overflow-y-auto border-indigo-500/50'>
			<div className='flex flex-col items-center justify-center mb-10'>
				<GiVote size={40} />
				<h1 className='hidden md:inline text-center text-3xl mt-2'>Voting</h1>
				<h2 className='hidden md:inline text-center text-xs italic'>Dapp</h2>
			</div>
			<ul className='flex flex-col gap-2 py-2 overflow-x-auto'>
				<li
					className={`flex justify-between p-4 cursor-pointer hover:bg-white hover:shadow-md ${
						active && 'bg-white shadow-md'
					}`}
					onClick={() => router.push(`/`)}
				>
					<div>
						<p className='text-xs md:text-base font-bold'>Main-Page</p>
					</div>
				</li>
				<li
					className={`flex justify-between p-4 cursor-pointer hover:bg-white hover:shadow-md ${
						active && 'bg-white shadow-md'
					}`}
					onClick={() => router.push(`/results/${1}`)}
				>
					<div>
						<p className='text-xs md:text-base font-bold'>Query Results</p>
					</div>
				</li>
				<li
					className={`flex justify-between p-4 cursor-pointer hover:bg-white hover:shadow-md ${
						active && 'bg-white shadow-md'
					}`}
					onClick={() => router.push(`/votes`)}
				>
					<div>
						<p className='text-xs md:text-base font-bold'>Recent votes</p>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
