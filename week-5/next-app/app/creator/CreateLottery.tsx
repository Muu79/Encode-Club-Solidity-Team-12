'use client'

import { InputField, PrimaryBtn } from "@/components/HtmlElements";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import * as lotteryCloneJson from '../../utils/abi/LotteryCloneFactory.json';

const CreateLottery = () => {
    const [{ wallet }] = useConnectWallet();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    const [created, setCreated] = useState<boolean>();
    const [lotteryCloner, setLotteryCloner] = useState<ethers.Contract>();
    const [tokenName, setTokenName] = useState<string>();
    const [tokenSymbol, setTokenSymbol] = useState<string>();
    const [ratio, setRatio] = useState<number>();
    const [price, setPrice] = useState<number>();
    const [fee, setFee] = useState<number>();
    let factoryAddress = process.env.FACTORY_CONTRACT as string;;

    const onClick = async () => {
        const notification = toast.loading('Creating Contract');
        if(!wallet) {toast.error('Please Connect Wallet', {id: notification}); return;}
        const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
        const signer = provider.getSigner();
        if(!factoryAddress) {toast.error('Please add Lottery Factory to env', {id: notification}); return;}
        const factoryContract = new ethers.Contract(factoryAddress, lotteryCloneJson.abi, signer);
        setLotteryCloner(factoryContract);
        try{
            const tx = await factoryContract.createLottery(
                tokenName,
                tokenSymbol,
                (ratio+""),
                parseEther(price+""),
                parseEther(fee+"")
                );
            const receipt = await tx.wait();
            if(receipt.blockNumber){
                toast.success('Successfully created lottery', {id: notification});
            }else{
                toast.error(`Failed to create lottery: ${receipt.reason}`, {id:notification});
            }
            
        }
        catch (err) {
            console.log(err);
            toast.error('Failed To Create Lottery', {id: notification});
        }
    }

    const handleChange = {
        name: (event: {target: {value: string}}) =>{
            setTokenName(event.target.value);
        },
        symbol: (event: {target: {value: string}}) =>{
            setTokenSymbol(event.target.value)
        },
        ratio: (event: {target: {value: number}}) =>{
            setRatio(event.target.value)
        },
        price: (event: {target: {value: number}}) =>{
            setPrice(event.target.value)
        },
        fee: (event: {target: {value: number}}) =>{
            setFee(event.target.value)
        }

    }
    
    



    return (<>
        {!created ?
            (<>
                <h1>Create Lottery</h1>
                <InputField inputType={"text"} placeholder={"Name of token to be created"} className="w-full" onChange={handleChange.name}/>
                <InputField inputType={"text"} placeholder={"Symbol for token eg. MYT"} onChange={handleChange.symbol}/>
                <InputField inputType={"number"} placeholder={"Number of tokens per Eth spent"} className='inline-flex' onChange={handleChange.ratio}/>
                <InputField inputType={"number"} placeholder={"Price per bet (in tokens)"} onChange={handleChange.price}/>
                <InputField inputType={"number"} placeholder={"House fee (in tokens)"} onChange={handleChange.fee}/>
                <PrimaryBtn name={"Create Lottery"} onClick={onClick}/>
            </>) :
            (<>
                <h1>Lottery Details</h1>
                <h2>Lottery Address: {}</h2>
                <h2>Lottery Token Address: {}</h2>
            </>)}
    </>)
};

export default CreateLottery;