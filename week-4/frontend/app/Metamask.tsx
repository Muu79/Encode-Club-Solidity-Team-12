'use client';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';

async function sendTransaction(wallets: any) {
	if (wallets[0]) {
		// create an ethers provider with the last connected wallet provider
		// if using ethers v6 this is:
		// ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
		const ethersProvider = new ethers.providers.Web3Provider(
			wallets[0].provider,
			'any'
		);

		const signer = ethersProvider.getSigner();

		// send a transaction with the ethers provider
		const txn = await signer.sendTransaction({
			to: '0x',
			value: 1,
		});

		const receipt = await txn.wait();
		console.log(receipt);
	}
}

export default function metamask() {
	const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

	// create an ethers provider
	let ethersProvider;

	if (wallet) {
		ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');
	}

	return (
		<div className='group absolute top-0 right-0 mr-8 mt-8'>
			{!wallet?.accounts ? (
				<button
					className=' px-4  py-2  text-sm  font-medium  text-white  bg-black dark:text-black dark:bg-white  rounded-md  bg-opacity-100 group-hover:bg-gray-100 group-hover:dark:bg-gray-600 focus:outline-none  focus-visible:ring-2  focus-visible:ring-white  focus-visible:ring-opacity-75'
					disabled={connecting}
					onClick={() => (wallet ? disconnect(wallet) : connect())}
				>
					{connecting ? (
						<span className='pr-2 text-gray-100 dark:text-black group-hover:text-black group-hover:dark:text-gray-100'>
							Connecting
						</span>
					) : wallet ? (
						<></>
					) : (
						<span className='pr-2 text-gray-100 dark:text-black group-hover:text-black group-hover:dark:text-gray-100'>
							Connect wallet
						</span>
					)}
				</button>
			) : null}
		</div>
	);
}
