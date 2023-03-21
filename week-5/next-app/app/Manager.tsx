'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { GiPerspectiveDiceSixFacesFour } from 'react-icons/gi';
import { BiMoneyWithdraw, BiTransfer } from 'react-icons/bi';
import { CiBeerMugFull } from 'react-icons/ci';
import { ethers } from 'ethers';
import * as LotteryJson from '@/utils/abi/Lottery.json';
import toast from 'react-hot-toast';
import { parseEther } from 'ethers/lib/utils';

export default function Manager() {
	const [showModal, setShowModal] = useState(false);
	const [{ wallet }] = useConnectWallet();
	const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
	const [status, setStatus] = useState<boolean>();
	const [owner, setOwner] = useState<boolean>();
	const [withdrawPrize, setWithdrawPrize] = useState();
	const [close, setClose] = useState<Date>(new Date(Date.now()));
	let lotteryAddress = process.env.LOTTERY_CONTRACT as string;

	const getStatus = async () => {
		if (!lotteryContract || !signer) return false;
		const ownerAddress = await lotteryContract.connect(signer).owner();
		setStatus(await lotteryContract.connect(signer).betsOpen());
		setOwner(
			ownerAddress.toLowerCase() == (await signer.getAddress()).toLowerCase()
		);
	};
	useEffect(() => {
		if (!wallet || !lotteryAddress) {
			setOwner(false);
			return;
		}
		setLotteryContract(new ethers.Contract(lotteryAddress, LotteryJson.abi));
		const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
		setSigner(provider.getSigner());
	}, [wallet]);

	useEffect(() => {
		if (!signer || !lotteryContract) return;
		setLotteryContract(lotteryContract.connect(signer));
	}, [signer]);

	useEffect(() => {
		if (!lotteryContract) return;
		getStatus();
	}, [lotteryContract]);

	const openBets = async () => {
		if (!lotteryContract || !signer) {
			console.log('oops');
			return;
		}
		const notification = toast.loading(`Opening lottery till ${close}`);
		try {
			const closeTimestamp = Math.floor(close.getTime() / 1000);
			const tx = await lotteryContract.openBets(closeTimestamp);
			const receipt = await tx.wait();
			if (receipt.blockNumber != undefined) {
				toast.success(`Lottery Opened till ${close}`, { id: notification });
			}
			setStatus(true);
		} catch (err) {
			console.error(err);
			toast.error(`Failed to open: ${err}`, { id: notification });
		}
	};

	const withdrawPool = async () => {
		const notification = toast.loading(`Withdrawing ${withdrawPrize} tokens`);
		if (!lotteryContract || !wallet) {
			toast.error('Please connect wallet', { id: notification });
			return;
		}
		if (!withdrawPrize) {
			toast.error('Please enter an amount to withdraw', { id: notification });
			return;
		}
		try {
			const tx = await lotteryContract.prizeWithdraw(parseEther(withdrawPrize));
			const receipt = await tx.wait();
			if (receipt.blockNumber) {
				toast.success(`Successfully withdrew ${withdrawPrize} tokens`, {
					id: notification,
				});
			} else {
				toast.error(`Something went wrong ${receipt.reason}`, {
					id: notification,
				});
			}
		} catch (err) {
			toast.error(`Error while processing tx`, { id: notification });
		}
	};

	const closeBets = async () => {
		if (!lotteryContract || !signer) return;
		const notification = toast.loading(`Closing Lottery...`);
		try {
			const tx = await lotteryContract.closeLottery();
			const receipt = await tx.wait();
			if (receipt.blockNumber != undefined) {
				toast.success('Successfully closed Lottery', { id: notification });
				setStatus(false);
			}
		} catch (err: any) {
			console.error(err);
			toast.error(`Failed to close: ${err?.reason}`, { id: notification });
		}
	};

	const handleChange = (event: { target: { value: string } }) => {
		const future = new Date(event.target.value);
		setClose(future);
		console.log(event.target.value, Math.floor(future.getTime() / 1000));
	};
	const withdrawPrizeChange = (event: { target: { value: any } }) => {
		setWithdrawPrize(event.target.value);
	};
	const managerButton =
		'bg-[#091F1C] p-2 flex-1 rounded-md border-[#004337] border-2 hover:bg-emerald-500/50';
	/**
	 * TODO:
	 *  1. Implement transfer ownership
	 *  2.
	 */
	return (
		<>
			{owner && (
				<div className='flex justify-center'>
					<div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
						<h2 className='font-bold '>Manager Controls</h2>
						<p className='mb-5 italic'>Total fees to be withdrawn: ...</p>
						<div className='flex text-white items-center space-x-1 bg-[#091B18] border-[#004337] border p-2'>
							<p>Closing date</p>
							<input
								className='flex w-full bg-transparent text-white text-right'
								type='datetime-local'
								onChange={handleChange}
							/>
						</div>
						<div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
							<button onClick={openBets} className={`${managerButton}`}>
								<GiPerspectiveDiceSixFacesFour
									size={25}
									className='mx-auto mb-2'
								/>
								Open bets
							</button>
							<button
								onClick={() => setShowModal(true)}
								className={`${managerButton}`}
							>
								<BiMoneyWithdraw size={25} className='mx-auto mb-2' />
								Withdraw owner pool
							</button>
							<button className={`${managerButton}`}>
								<BiTransfer size={25} className='mx-auto mb-2' />
								Transfer ownership
							</button>
							<button onClick={closeBets} className={`${managerButton}`}>
								<CiBeerMugFull size={25} className='mx-auto mb-2' />
								Close lottery
							</button>
						</div>
					</div>
				</div>
			)}
			{showModal ? (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
						<div className='relative w-auto my-6 mx-auto max-w-3xl'>
							{/* Content */}
							<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
								{/* modal header */}
								<div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
									<h3 className='text-3xl text-slate-500 font-semibold'>
										Withdraw pool
									</h3>
									<button
										className='text-black p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
										onClick={() => setShowModal(false)}
									>
										<AiFillCloseSquare size={25} />
									</button>
								</div>

								{/* body */}
								<div className='relative p-6 flex-auto'>
									<div className='flex text-[#091B18] items-center space-x-1 bg-white border-[#004337] border p-2'>
										<p>Amount</p>
										<input
											className='flex w-full bg-transparent text-[#091F1C] text-right'
											type='number'
											placeholder={'amount to withdraw'}
											onChange={withdrawPrizeChange}
										/>
									</div>
								</div>
								{/* footer */}
								<div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
									<button
										className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 ease-linear transition-all duration-150'
										onClick={async () => {
											await withdrawPool();
											setShowModal(false);
										}}
									>
										Send
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
				</>
			) : null}
		</>
	);
}
