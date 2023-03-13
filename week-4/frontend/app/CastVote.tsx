'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
<<<<<<< HEAD

const CastVote = () => {
	const [{ wallet }] = useConnectWallet();
=======
import { SetStateAction, useState } from 'react';

const CastVote = () => {
	const [{ wallet }] = useConnectWallet();
	const [voteAmount, setVoteAmount] = useState<number>(-1);
	const [voteIndex, setVoteIndex] = useState<number>(-1);
>>>>>>> c99dce5ae4af07915d87d8007e1b692d181b5f33
	// create an ethers provider
	let ethersProvider;
	async function castVote(
		amount: number,
		proposal: number,
		ballotAddress: string
	) {
<<<<<<< HEAD
		if (wallet) {
=======
		if (wallet && voteAmount > 0 && voteIndex > 0) {
>>>>>>> c99dce5ae4af07915d87d8007e1b692d181b5f33
			// API call to backend
			// request(castVote, amount, proposal, ballotAddress)

			ethersProvider = new ethers.providers.Web3Provider(
				wallet.provider,
				'any'
			);

			const signer = ethersProvider.getSigner();

			const txn = await signer.sendTransaction({
				to: '0x109bf5e11140772a1427162bb51e23c244d13b88',
				data: '<unsigned hash from backend>',
			});

			const receipt = await txn.wait();
			console.log(receipt);
		}
	}
<<<<<<< HEAD
=======

	const handleChange = {
		voteAmount: (event: { target: { value: SetStateAction<number>; }; }) => {
			setVoteAmount(event.target.value);
		},
		voteIndex: (event: { target: { value: SetStateAction<number>; }; }) => {
			setVoteIndex(event.target.value);
		}
	}

>>>>>>> c99dce5ae4af07915d87d8007e1b692d181b5f33
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Vote</h2>
			<p>Cast your vote.</p>
<<<<<<< HEAD
			<InputField inputType='number' placeholder='Index of proposal' />
			<PrimaryBtn
				name='Cast Vote'
				onClick={() => castVote(1, 0, 'BallotAddress')}
=======
			<InputField inputType='number' placeholder='Index of proposal' onChange={handleChange.voteIndex} />
			<InputField inputType='number' placeholder='Amount of voting Power to use' onChange={handleChange.voteAmount}/>
			<PrimaryBtn
				name='Cast Vote'
				onClick={() => castVote(voteAmount, voteIndex, 'BallotAddress')}
>>>>>>> c99dce5ae4af07915d87d8007e1b692d181b5f33
			/>
		</>
	);
};

export default CastVote;
