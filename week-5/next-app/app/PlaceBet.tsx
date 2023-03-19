'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';
import { useConnectWallet } from '@web3-onboard/react';
import { createRef, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ethers, BigNumber, BigNumberish, Contract } from 'ethers';
import * as lotteryJson from '../utils/abi/Lottery.json';
import * as lotteryTokenJson from '../utils/abi/LotteryToken.json';
import { connected } from 'process';
import { formatEther } from 'ethers/lib/utils';

const PlaceBet = () => {
    const [{ wallet }] = useConnectWallet();
    const [betAmount, setBetAmount] = useState<number>(-1);
    const [betFee, setBetFee] = useState<BigNumber>();
    const [tokenContract, setTokenContract] = useState<ethers.Contract>();
    const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    let ethersProvider,
        tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as string,
        lotteryAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

    useEffect(() => {
        if(!signer) return;
        setTokenContract(tokenContract?.connect(signer));
        setLotteryContract(lotteryContract?.connect(signer));
    }, [signer])
    
    useEffect(() => {
        console.log('use Effect contracts');
        
        if (!tokenContract || !lotteryContract) {
            setTokenContract(new ethers.Contract(tokenAddress, lotteryTokenJson.abi));
            setLotteryContract(new ethers.Contract(lotteryAddress, lotteryJson.abi));
        }else if(!wallet) return;
        else{
            getFee().then(value => {
                setBetFee(value);
            });
        }
    }, [lotteryContract])

    useEffect(() => {
        console.log("use Effect Wallet");
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
        const total = (await lotteryContract.betFee()).add(await lotteryContract.betPrice());
        return Promise.resolve(total);
    }

    async function betTokens(amount: number) {
        amount = Math.abs(amount);
        if (wallet && amount > 0) {
            const address = wallet.accounts[0].address;
            const notification = toast.loading(
                `Betting ${amount} time${amount > 1 ? 's' : ''} for ${address.substring(0, 6)}`
            );
            try {
                console.log('started');

                const userTokenBal : BigNumber = await tokenContract.balanceOf(wallet.accounts[0].address);
                console.log(userTokenBal.toString(), betFee);

                if (betFee && userTokenBal >=  betFee) {

                    const tx = await lotteryContract.connect(signer).betMany(amount);
                    const receipt = await tx.wait();
                    if (receipt.blockNumber !== undefined) {
                        toast.success(`Successfully bet time${amount > 1 ? 's' : ''}`, { id: notification });
                    } else {
                        toast.error('Something went wrong!', { id: notification });
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
