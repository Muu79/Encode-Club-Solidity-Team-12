'use client'
import { InputField, PrimaryBtn } from "@/components/HtmlElements";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as lotteryJson from '../utils/abi/Lottery.json'


const BurnTokens = () => {
    const [{ wallet }] = useConnectWallet();
    const [burnAmount, setBurnAmount] = useState<number>(-1);
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
    const lotteryAddress = process.env.LOTTERY_CONTRACT as string;

    useEffect(() => {
        if (!wallet || !wallet.provider) return;
        const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
        setSigner(provider.getSigner());
    }, [wallet])

    useEffect(() => {
        setLotteryContract(new ethers.Contract(lotteryAddress, lotteryJson.abi, signer));
    }, [signer])

    const handleChange = (event: { target: { value: SetStateAction<number> } }) => {
        setBurnAmount(event.target.value);
    }

    const burnTokens = async () => {
        if (!signer || !lotteryContract) return;
        const notification = toast.loading(`Burning ${burnAmount} tokens`)
        try {
            const tx = await lotteryContract.returnTokens(parseEther(('' + burnAmount)));
            const receipt = await tx.wait();
            if(receipt.blockNumber != undefined){
                toast.success(`Successfully burnt ${burnAmount} tokens`, {id: notification});
            }else{
                toast.error(`Error when burning tokens: ${receipt.message}`, {id: notification});
            }
        }catch(err){
            console.error(err);
            toast.error(`Error with issuing transaction`);
        }
    }

    return (<>
        <h2 className='text-xl text-left mb-3'>Burn Tokens</h2>
        <p>Burn lottery tokens to receive ETH</p>
        <InputField
            inputType='number'
            placeholder='Amount of tokens'
            onChange={handleChange}
        />
        <PrimaryBtn
            name='Burn Tokens'
            onClick={burnTokens}
        />
    </>
    )
}

export default BurnTokens;