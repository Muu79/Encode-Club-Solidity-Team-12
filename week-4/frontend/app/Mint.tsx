'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useRef, useState } from 'react';

const Mint = () => {
	const [{ wallet }] = useConnectWallet();
	const [mintAmount, setMintAmount] = useState<number>(-1);

	async function mint(amount: number) {
		if (wallet && mintAmount > 0) {
			console.log('address: ', wallet.accounts[0].address);
			console.log('amount: ', amount);
		}
	}

	const handleChange = (event: { target: { value: SetStateAction<number>; }; }) =>{
		setMintAmount(event.target.value);
	}

	return (
		<>
			<h2 className='text-xl text-left mb-3'>Request Tokens</h2>
			<p>Mint voting tokens.</p>
			<InputField inputType='number' placeholder='Amount of tokens' onChange={handleChange}/>
			<PrimaryBtn name='Request Tokens' onClick={() => mint(mintAmount)} />
		</>
	);
};

export default Mint;
