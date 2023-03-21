'use client';
import { useState } from 'react';

export default function Winner() {
	const [hasWinnings, setHasWinnings] = useState(false);
	/** TODO:
	 *  1. Find winning amount
	 *  2. Function to withdraw winnings
	 *  3. Confetti effect
	 */
	return (
		<>
			{hasWinnings && (
				<div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
					<button className='p-5 bg-gradient-to-br from-purple-600 to-blue-500 animate-bounce text-center rounded-xl w-full'>
						<p className='font-bold'>Yay! WINNER</p>
						<p>Withdraw winnings: ...</p>
						<br />
						<p className='font-semibold'>Click here</p>
					</button>
				</div>
			)}
		</>
	);
}
