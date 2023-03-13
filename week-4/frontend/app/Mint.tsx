'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const Mint = () => {
	const [{ wallet }] = useConnectWallet();
	const [mintAmount, setMintAmount] = useState<number>(-1);

	async function mint(amount: number) {
		if (wallet && mintAmount > 0) {
			const address = wallet.accounts[0].address;
			console.log('address: ', address);
			console.log('amount: ', amount);
			const notification = toast.loading(
				`Minting ${amount} for ${address.substring(0, 6)}`
			);
			try {
				const res = await fetch(`api/mint-token/${address}/${amount}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				await res.json();
				toast.success('Successfully minted', { id: notification });
			} catch (error) {
				toast.error('Whoops... Failed to mint!', { id: notification });
			}
		}
	}

	const handleChange = (event: {
		target: { value: SetStateAction<number> };
	}) => {
		setMintAmount(event.target.value);
	};

	return (
		<>
			<h2 className='text-xl text-left mb-3'>Request Tokens</h2>
			<p>Mint voting tokens.</p>
			<InputField
				inputType='number'
				placeholder='Amount of tokens'
				onChange={handleChange}
			/>
			<PrimaryBtn name='Request Tokens' onClick={() => mint(mintAmount)} />
		</>
	);
};

export default Mint;
