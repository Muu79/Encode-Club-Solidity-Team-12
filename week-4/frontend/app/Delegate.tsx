'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Delegate = () => {
	const [{ wallet }] = useConnectWallet();
	const [delegateAddress, setDelegateAddress] = useState<string>('');

	// create an ethers provider
	let ethersProvider;
	const delegate = async (to: string) => {
		//Internal API Call
		if (wallet) {
			if (to === '') to = wallet.accounts[0].address;
			const notification = toast.loading(
				`Delegating to address ${to.substring(0, 6)}`
			);
			try {
				const res = await fetch(`api/delegate/${to}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await res.json();
				if (!data.response.unsignedHash) {
					toast.error('Backend server not responding!', { id: notification });
					return;
				}
				console.log(data);
				const address = data.response.address;
				const unsignedHash = data.response.unsignedHash;
				ethersProvider = new ethers.providers.Web3Provider(
					wallet.provider,
					'any'
				);

				const signer = ethersProvider.getSigner();

				const txn = await signer.sendTransaction({
					to: address,
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

	const handleChange = {
		delegateAddress: (event: { target: { value: SetStateAction<string> } }) => {
			setDelegateAddress(event.target.value);
		},
	};
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Delegate</h2>
			<p>Delegate your voting power.</p>
			<InputField
				inputType='string'
				placeholder='Address of delegate'
				onChange={handleChange.delegateAddress}
			/>
			<PrimaryBtn
				name='Delegate Vote'
				onClick={() => delegate(delegateAddress)}
			/>
		</>
	);
};

export default Delegate;
