'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Delegate = () => {
	const [delegateAddress, setDelegateAddress] = useState<string>('');
	const [{ wallet }] = useConnectWallet();

	// create an ethers provider
	let ethersProvider;
	const delegate = async (to: string) => {
		let toDelegate = to;
		const tokenContract =
			process.env.NEXT_PUBLIC_TOKEN_CONTRACT ||
			'0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635';
		//Internal API Call
		if (wallet) {
			if (to === '') toDelegate = wallet.accounts[0].address;
			const notification = toast.loading(
				`Delegating to address ${toDelegate.substring(0, 6)}`
			);
			try {
				const res = await fetch(`api/delegate/${toDelegate}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await res.json();
				let unsignedHash;
				if (data.response.unsignedHash)
					unsignedHash = data.response.unsignedHash;
				console.log(data);
				ethersProvider = new ethers.providers.Web3Provider(
					wallet.provider,
					'any'
				);

				const signer = ethersProvider.getSigner();

				const txn = await signer.sendTransaction({
					to: tokenContract,
					data: unsignedHash,
				});

				const receipt = await txn.wait();
				console.log(receipt);
				toast.success('Successfully Delegated!', { id: notification });
			} catch (error) {
				toast.error('Whoops... You didnt delegate!', { id: notification });
			}
		}
	};

	const handleChange = (event: any) => {
		setDelegateAddress(event.target.value);
	};
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Delegate</h2>
			<p>Delegate your voting power.</p>
			<InputField
				inputType='number'
				placeholder='Address of delegate'
				onChange={handleChange}
			/>
			<PrimaryBtn
				name='Delegate Vote'
				onClick={() => delegate(delegateAddress)}
			/>
		</>
	);
};

export default Delegate;
