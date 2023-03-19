'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SidebarRow = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [active, setActive] = useState(1);

	useEffect(() => {
		if (!pathname) return;
		if (pathname.includes('manager')) setActive(2);
		else if (pathname.includes('votes')) setActive(3);
		else setActive(1);

		return () => {};
	}, [pathname]);

	return (
		<ul className='flex flex-col gap-2 py-2 overflow-x-auto'>
			<li
				className={`flex justify-between p-4 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-200 hover:dark:text-gray-500 hover:shadow-md ${
					active == 1 && 'bg-gray-100 dark:text-gray-700 shadow-md'
				}`}
				onClick={() => router.push(`/`)}
			>
				<div>
					<p className='text-xs md:text-base font-bold'>Main-Page</p>
				</div>
			</li>
			<li
				className={`flex justify-between p-4 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-200 hover:dark:text-gray-500 hover:shadow-md ${
					active == 2 && 'bg-gray-100 dark:text-gray-700 shadow-md'
				}`}
				onClick={() => router.push(`/manager`)}
			>
				<div>
					<p className='text-xs md:text-base font-bold'>Lottery Manager</p>
				</div>
			</li>
		</ul>
	);
};

export default SidebarRow;
