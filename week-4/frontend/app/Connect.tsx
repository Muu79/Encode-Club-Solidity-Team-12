'use client';
import { useState, useEffect, ChangeEvent } from "react";
import { ethers, providers, Signer, BigNumberish } from 'ethers';
import { parseEther } from "ethers/lib/utils";


// For metamask integration
declare global {
	interface Window {
		ethereum?: any;
	}
}

const Connect = () => {
	const [provider, setProvider] = useState<providers.Web3Provider | providers.BaseProvider | providers.FallbackProvider>();
	const [userSigner, setUserSigner] = useState<Signer | undefined>(undefined);
	const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
	const [userEthBalance, setUserEthBalance] = useState<BigNumberish | undefined>(undefined);
	const [connected, setConnected] = useState<boolean>(false);
	const [hasMM, setHasMM] = useState<boolean>(false);
	const [priKey, setPriKey] = useState<string | undefined>(undefined);

	//set states at start
	useEffect(() => {
		//test if metamask is installed 
		if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') setHasMM(true);
	},
		[])

	//used object to handle different connection types
	const handleConnect = async () => {
		let signer, provider;
		if (!hasMM && priKey) {
			provider = ethers.getDefaultProvider('goerli');
			// This is unsafe since we use a state signer with a privatekey or a state private key itself
			// Might be a better way to do this
			const wallet = new ethers.Wallet(priKey, provider);
			signer = wallet.connect(provider);
		} else {
			// 'pop' MetaMask
			provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner();
		}
		const address = await signer.getAddress();
		const balanceBN = await signer.getBalance();

		setProvider(provider);
		setUserSigner(signer);
		setWalletAddress(address);
		setUserEthBalance(balanceBN);
		setConnected(true);
	}


	const handlePKChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPriKey(event.target.value);
	}
	return (
		<div className='group absolute top-0 right-0 mr-8 mt-8'>
			{connected ?
				<div>
					<p className="flex flex-col text-right">
						<span>Connected to {walletAddress?.slice(0, 5)}...{walletAddress?.slice(38)}</span>
						<span>ETH: {ethers.utils.formatEther(userEthBalance ? userEthBalance : 0).slice(0, 7)}</span>
					</p>
				</div>
				: (
					<button
						type='button'
						className=' px-4  py-2  text-sm  font-medium  text-white  bg-black dark:text-black dark:bg-white  rounded-md  bg-opacity-100 group-hover:bg-gray-100 group-hover:dark:bg-gray-600 focus:outline-none  focus-visible:ring-2  focus-visible:ring-white  focus-visible:ring-opacity-75'
						onClick={handleConnect}>
						<span className='pr-2 text-gray-100 dark:text-black group-hover:text-black group-hover:dark:text-gray-100'>
							Connect wallet
						</span>
					</button>)
			}

		</div>
	)
};

export default Connect;
