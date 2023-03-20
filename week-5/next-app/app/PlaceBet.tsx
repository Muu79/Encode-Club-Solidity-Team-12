'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ethers, BigNumber, BigNumberish, Contract } from 'ethers';
import * as lotteryJson from '../utils/abi/Lottery.json';
import * as lotteryTokenJson from '../utils/abi/LotteryToken.json';
import { connected } from 'process';
import { formatEther, parseEther } from 'ethers/lib/utils';

const PlaceBet = () => {
    const [{ wallet }] = useConnectWallet();
    const [betAmount, setBetAmount] = useState<number>(-1);
    const [betFee, setBetFee] = useState<BigNumber>();
    const [tokenContract, setTokenContract] = useState<ethers.Contract>();
    const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    let ethersProvider,
        tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as string,
        lotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT as string;

    useEffect(() => {
        if(!signer) return;
        setTokenContract(new ethers.Contract(tokenAddress, lotteryTokenJson.abi, signer));
        setLotteryContract(new ethers.Contract(lotteryAddress, lotteryJson.abi, signer));
    }, [signer])
    
    useEffect(() => {
        
        if(!wallet || !lotteryContract) return;
        else{
            getFee().then(value => {
                setBetFee(value);
            });
        }
    }, [lotteryContract])

    useEffect(() => {
        if (!wallet) {
            return
        };
        ethersProvider = new ethers.providers.Web3Provider(
            wallet.provider,
            'any'
        );
        setSigner(ethersProvider.getSigner());
        console.log('signer ', signer);
    }, [wallet])

    const getFee = async () => {
        if(!lotteryContract) return;
        const total = (await lotteryContract.betFee()).add(await lotteryContract.betPrice());
        return Promise.resolve(total);
    }

    const createAllowance = async () => {
        if(!tokenContract || !lotteryAddress || !signer || !betFee) return;
        const allowance = await tokenContract.connect(signer).approve(lotteryAddress, parseEther('1000'));
        await allowance.wait();
    }

    async function betTokens(amount: number) {
        if(!lotteryContract || !tokenContract || !signer || !betFee) return;
        amount = Math.abs(amount);
        const allowance = await tokenContract.allowance(wallet?.accounts[0].address, lotteryAddress);
        if(allowance <= betFee.mul(amount)) await createAllowance();
        if (wallet && amount > 0) { 
            const address = wallet.accounts[0].address;
            const notification = toast.loading(
                `Betting ${amount} time${amount > 1 ? 's' : ''} for ${address.substring(0, 6)}`
            );
            try {
                const userTokenBal : BigNumber = await tokenContract.balanceOf(wallet.accounts[0].address);
                if (betFee && userTokenBal >=  betFee.mul(amount)) {
                    const tx = await lotteryContract.betMany(amount);
                    const receipt = await tx.wait();
                    if (receipt.blockNumber !== undefined) {
                        toast.success(`Successfully bet ${amount} time${amount > 1 ? 's' : ''}`, { id: notification });
                    } else {
                        toast.error('Something went wrong!\n' + `${receipt.reason}`, { id: notification });
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('Whoops... Failed to purchase!', { id: notification });
            }
        }
    }

    const handleChange = (event: {
        target: { value: SetStateAction<number> };
    }) => {
        setBetAmount(event.target.value);
    };

    return (
        <>
            <h2 className='text-xl text-left mb-3'>Bet Tokens</h2>
            <p>Bet {betFee ? formatEther(betFee).slice(0, 3) + " " : ""}tokens for current lottery</p>
            <InputField
                inputType='number'
                placeholder='number of bets'
                onChange={handleChange}
            />
            <PrimaryBtn name='Bet Tokens' onClick={() => betTokens(betAmount)} />
        </>
    );
};

export default PlaceBet;
