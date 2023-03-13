'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';

const Mint = () => {
	const [{ wallet }] = useConnectWallet();

	async function mint(amount: number) {
		if (wallet) {
			console.log('address: ', wallet.accounts[0].address);
			console.log('amount: ', amount);
		}
	}

	return (
		<>
			<h2 className='text-xl text-left mb-3'>Request Tokens</h2>
			<p>Mint voting tokens.</p>
			<InputField inputType='number' placeholder='Amount of tokens' />
			<PrimaryBtn name='Request Tokens' onClick={() => mint(1)} />
		</>
	);
};

export default Mint;
