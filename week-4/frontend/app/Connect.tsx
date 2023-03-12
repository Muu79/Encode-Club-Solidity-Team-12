'use client';

const Connect = () => {
	return (
		<div className='group absolute top-0 right-0 mr-8 mt-8'>
			<button
				type='button'
				className=' px-4  py-2  text-sm  font-medium  text-white  bg-black dark:text-black dark:bg-white  rounded-md  bg-opacity-100 group-hover:bg-gray-100 group-hover:dark:bg-gray-600 focus:outline-none  focus-visible:ring-2  focus-visible:ring-white  focus-visible:ring-opacity-75'
			>
				<span className='pr-2 text-gray-100 dark:text-black group-hover:text-black group-hover:dark:text-gray-100'>
					Connect wallet
				</span>
			</button>
		</div>
	);
};

export default Connect;
