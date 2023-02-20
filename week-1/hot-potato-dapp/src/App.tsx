import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { contractAddress } from './assets/constants';
import contractAbi from './abi.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	const [accounts, setAccounts] = useState<Array<string>>([]);
	const [textInput, setTextInput] = useState('');
	const [newOwner, setNewOwner] = useState('');

	const handleAccountsChanged = (newaccounts: Array<string>) => {
		if (newaccounts.length === 0) {
			// MetaMask is locked or the user has not connected any accounts
			console.log('Please connect to MetaMask.');
		} else if (newaccounts[0] !== accounts[0]) {
			setAccounts(newaccounts);
			console.log('Using account: ', accounts[0]);
		}
	};

	const connectAccounts = async () => {
		if (window.ethereum == null) {
			console.log('MetaMask not installed');
		} else {
			try {
				const accounts: Array<string> = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});
				//.then(handleAccountsChanged)
				//.catch((err: any) => {
				//	if (err.code === 4001) {
				//		// EIP-1193 userRejectedRequest error
				//		// If this happens, the user rejected the connection request.
				//		console.log('Request rejected by user.');
				//	} else {
				//		console.error(err);
				//	}
				//});
				setAccounts(accounts);
				console.log(accounts);
			} catch (error) {
				console.error(error);
				toast.error('Error, check log!');
			}
		}
	};

	const setText = async (newText: string) => {
		if (newText === '') {
			toast.warn('Setting empty text');
		}
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				contractAbi,
				signer
			);
			try {
				//console.log(contract);
				//let balance = await provider.getBalance(accounts[0]);
				//console.log(balance);
				//let tx = await signer.sendTransaction({
				//	to: '0x8B60148AE5BeDe18Aa0e2100361cB0e0E3fd90c7',
				//	value: ethers.parseEther('0.01'),
				//});
				//console.log(await tx.wait());
				const response = await contract.setText(newText);
				console.log('Response: ', response);
				await response.wait();
				const toastResponse = await contract.helloWorld();
				toast.success('setText to: ' + toastResponse);
			} catch (error) {
				console.warn('Error: ', error);
				toast.error('Error, check log!');
			}
		}
	};

	const getText = async () => {
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				contractAbi,
				signer
			);
			try {
				const response = await contract.helloWorld();
				console.log('Response: ', response);
				toast(response);
			} catch (error) {
				console.warn('Error: ', error);
				toast.error('Error, check log!');
			}
		}
	};

	const transferOwnership = async (nOwner: string) => {
		if (nOwner === '') {
			toast.warn('Add an address in the TextField');
			return;
		}
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				contractAbi,
				signer
			);
			try {
				const response = await contract.transferOwnership(nOwner);
				await response.wait();
				const toastResponse = await contract.owner();
				toast.success('setOwner to: ' + toastResponse);
			} catch (error) {
				console.warn('Error: ', error);
				toast.error('Error, check log!');
			}
		}
	};

	const getOwner = async () => {
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				contractAbi,
				signer
			);
			try {
				const response = await contract.owner();
				console.log('Response: ', response);
				toast(response);
			} catch (error) {
				console.warn('Error: ', error);
				toast.error('Error, check log!');
			}
		}
	};

	return (
		<div className='flex justify-center min-h-screen sm:px-16 px-6 bg-site-black'>
			<ToastContainer />
			<div className='flex justify-between items-center flex-col max-w-[1280px] w-full'>
				<header className='flex flex-row justify-between items-center w-full sm:py-10 py-6'>
					{accounts.length ? (
						<div className='absolute right-0'>
							{accounts.map((account) => (
								<p key={account} className='text-white'>
									{account.substring(0, 6)}
									{'...'}
									{account.substring(account.length - 4)}
								</p>
							))}
							<button
								className='bg-blue-500 border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-xl leading-[24px] hover:bg-pink-600 transition-all'
								type='button'
								onClick={connectAccounts}
							>
								Reconnect
							</button>
						</div>
					) : (
						<button
							className='bg-site-pink border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-xl leading-[24px] hover:bg-pink-600 transition-all'
							type='button'
							onClick={connectAccounts}
						>
							Connect wallet
						</button>
					)}
				</header>
				<div className='flex-1 flex justify-start items-center flex-col w-full mt-4'>
					<h1 className='text-white font-poppins font-black text-5xl tracking-wide'>
						Week-1
					</h1>
					<p className='text-dim-white font-poppins font-medium mt-3 text-base'>
						Encode solidity bootcamp - Team 12
					</p>

					<div className='mt-10 w-full flex justify-center cursor-grab'>
						<div className='relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full p-[2px] rounded-3xl'>
							<div className='w-full min-h-[400px] bg-[#262341] backdrop-blur-[4px] rounded-3xl shadow-card flex p-10'>
								<div className='text-white'>
									<div className='flex flex-col w-full items-center'>
										<div className='flex gap-1 mb-4'>
											<button
												onClick={async () => {
													await getText();
												}}
												className={`bg-[#0b556b] border-none outline-none px-6 py-2 font-poppins font-bold text-sm rounded-2xl leading-[24px] transition-all min-h-[56px]`}
											>
												Get Text
											</button>
											<button
												onClick={async () => {
													await getOwner();
												}}
												className={`bg-[#0b556b] border-none outline-none px-6 py-2 font-poppins font-bold text-sm rounded-2xl leading-[24px] transition-all min-h-[56px]`}
											>
												Get Owner
											</button>
										</div>
										<div className='mb-8 w-[100%]'>
											<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[64px] sm:p-8 p-4 rounded-[20px]'>
												<input
													placeholder='setText'
													type='text'
													value={textInput}
													disabled={false}
													onChange={(e) => {
														typeof setTextInput === 'function' &&
															setTextInput(e.target.value);
													}}
													className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white'
												/>
											</div>
										</div>

										<div className='mb-2 w-[100%]'>
											<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[64px] sm:p-8 p-4 rounded-[20px]'>
												<input
													placeholder='transferOwnership'
													type='text'
													value={newOwner}
													disabled={false}
													onChange={(e) => {
														typeof setNewOwner === 'function' &&
															setNewOwner(e.target.value);
													}}
													className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white'
												/>
											</div>
										</div>
										<div className='flex gap-1'>
											<button
												onClick={async () => {
													await setText(textInput);
												}}
												className={`bg-[#19a0c9] border-none outline-none px-6 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]`}
											>
												Set Text
											</button>
											<button
												onClick={async () => {
													await transferOwnership(newOwner);
												}}
												className={`bg-[#19a0c9] border-none outline-none px-6 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]`}
											>
												Set Owner
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
