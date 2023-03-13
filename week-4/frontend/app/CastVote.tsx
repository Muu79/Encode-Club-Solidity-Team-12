'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import { SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';

const CastVote = () => {
	const [{ wallet }] = useConnectWallet();
	const [voteAmount, setVoteAmount] = useState<number>(-1);
	const [voteIndex, setVoteIndex] = useState<number>(-1);
	// create an ethers provider
	let ethersProvider;
	async function castVote(
		amount: number,
		proposal: number,
		ballotAddress: string
	) {
		if (wallet && voteAmount > 0) {
			// API call to backend
			// request(castVote, amount, proposal, ballotAddress)
			const notification = toast.loading(
				`Casting ${amount} votes for ${ballotAddress.substring(0, 6)}`
			);
			try {
				const res = await fetch(
					`api/cast-vote/${ballotAddress}/${proposal}/${amount}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				const response = await res.json();
				const data = response.response.unsignedHash;
				console.log(data);
				ethersProvider = new ethers.providers.Web3Provider(
					wallet.provider,
					'any'
				);

				const signer = ethersProvider.getSigner();

				const txn = await signer.sendTransaction({
					to: ballotAddress,
					data: data,
				});

				const receipt = await txn.wait();
				console.log(receipt);
				toast.success('Successfully Voted!', { id: notification });
			} catch (error) {
				toast.error('Whoops... You didnt vote!', { id: notification });
			}
		}
	}

	const handleChange = {
		voteAmount: (event: { target: { value: SetStateAction<number> } }) => {
			setVoteAmount(event.target.value);
		},
		voteIndex: (event: { target: { value: SetStateAction<number> } }) => {
			setVoteIndex(event.target.value);
		},
	};

	return (
		<>
			<h2 className='text-xl text-left mb-3'>Vote</h2>
			<p>Cast your vote.</p>
			<InputField
				inputType='number'
				placeholder='Index of proposal'
				onChange={handleChange.voteIndex}
			/>
			<InputField
				inputType='number'
				placeholder='Amount of voting Power to use'
				onChange={handleChange.voteAmount}
			/>
			<PrimaryBtn
				name='Cast Vote'
				onClick={() =>
					castVote(
						voteAmount,
						voteIndex,
						process.env.NEXT_PUBLIC_CONTRACT ||
							'0x9B93774789584f3c665202Ee0609dDEfF5Cfee30'
					)
				}
			/>
		</>
	);
};

export default CastVote;
