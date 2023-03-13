'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useState } from 'react';

const Delegate = () => {
	const [delegateAddress, setDelegateAddress] = useState<string>("");

	const delegate = (to:string) => {
		//Internal API Call
	}

	const handleClick = () => {
		//Call API for TX
		//Sign TX
	}

	const handleChange = (event: any) => {
		setDelegateAddress(event.target.value);
	}
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Delegate</h2>
			<p>Delegate your voting power.</p>
			<InputField inputType='number' placeholder='Address of delegate' onChange={handleChange}/>
			<PrimaryBtn name='Delegate Vote' onClick={handleClick}/>
		</>
	);
};

export default Delegate;
