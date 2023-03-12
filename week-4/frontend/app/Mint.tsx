'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';

const Mint = () => {
	return (
		<>
			<h2 className='text-xl text-left mb-3'>
				Request Tokens <span>-&gt;</span>
			</h2>
			<p>Mint voting tokens.</p>
			<InputField inputType='number' placeholder='Amount of tokens' />
			<PrimaryBtn name='Request Tokens' />
		</>
	);
};

export default Mint;
