'use client';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useWeb3Context } from './ClientProvider';

const RPC_URL = 'https://goerli.infura.io/v3/';

const injected = injectedModule(); // { displayUnavailable: true }

const appMetadata = {
	name: 'Voting Dapp',
	icon: '/twelve.svg',
	logo: '/Team.svg',
	description: 'Early Team-12 week-4 Voting project',
	gettingStartedGuide:
		'https://github.com/Muu79/Encode-Club-Solidity-Team-12/tree/main/week-4',
	recommendedInjectedWallets: [
		{ name: 'MetaMask', url: 'https://metamask.io' },
	],
};

const onboard = Onboard({
	wallets: [injected],
	chains: [
		{
			id: '0x5',
			token: 'GoerliETH',
			label: 'Goerli test network',
			rpcUrl: RPC_URL,
			publicRpcUrl: RPC_URL,
			blockExplorerUrl: 'https://goerli.etherscan.io/',
			// color: 'black',
		},
	],
	appMetadata,
	// theme: 'dark',
});

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
	const { connected, setConnected, wallets, setWallets } = useWeb3Context();
	async function handleConnect() {
		setConnected(false);
		const wallet = await onboard.connectWallet();
		console.log(wallet?.length > 0);
		if (wallet?.length > 0) {
			setWallets(wallet);
			setConnected(true);
		}
		console.log('wallet: ', wallet);
		console.log(wallets);
	}
	useEffect(() => {
		console.log('useEffect');
		console.log('wallets: ', wallets);
	}, []);
	return (
		<div className='group absolute top-0 right-0 mr-8 mt-8'>
			{!connected ? (
				<button
					type='button'
					className=' px-4  py-2  text-sm  font-medium  text-white  bg-black dark:text-black dark:bg-white  rounded-md  bg-opacity-100 group-hover:bg-gray-100 group-hover:dark:bg-gray-600 focus:outline-none  focus-visible:ring-2  focus-visible:ring-white  focus-visible:ring-opacity-75'
					onClick={handleConnect}
				>
					<span className='pr-2 text-gray-100 dark:text-black group-hover:text-black group-hover:dark:text-gray-100'>
						Connect wallet
					</span>
				</button>
			) : (
				<></>
			)}
		</div>
	);
}
