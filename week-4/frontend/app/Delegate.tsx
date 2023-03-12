'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';

const Delegate = () => {
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Delegate</h2>
			<p>Delegate your voting power.</p>
			<InputField inputType='number' placeholder='Address of delegate' />
			<PrimaryBtn name='Delegate Vote' />
		</>
	);
};

export default Delegate;
