'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';

const CastVote = () => {
	const [{ wallet }] = useConnectWallet();
	// create an ethers provider
	let ethersProvider;
	async function castVote(
		amount: number,
		proposal: number,
		ballotAddress: string
	) {
		if (wallet) {
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
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Vote</h2>
			<p>Cast your vote.</p>
			<InputField inputType='number' placeholder='Index of proposal' />
			<PrimaryBtn
				name='Cast Vote'
				onClick={() => castVote(1, 0, 'BallotAddress')}
			/>
		</>
	);
};

export default CastVote;
