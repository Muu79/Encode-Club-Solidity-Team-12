'use client'

import { InputField, PrimaryBtn } from "@/components/HtmlElements";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as lotteryJson from '../../utils/abi/Lottery.json';

const WithdrawPrize = (props: 
    {signer: ethers.providers.JsonRpcSigner,
    lotteryContract: ethers.Contract,
    owner: boolean,
    }
    ) => {
    const [{ wallet }] = useConnectWallet();
    const {signer, lotteryContract, owner} = props;
    const [prizePool, setPrizePool] = useState(0);
    const [withdrawPrize, setWithPrize] = useState();
    const [withdrawOwner, setWithOwner] = useState();
    const [ownerPool, setOwnerPool] = useState(0);
    const lotteryAddress = lotteryContract.address;

    useEffect(() => {
        if (!lotteryContract) return;
        lotteryContract.prize(wallet?.accounts[0].address).then((value: SetStateAction<number>) => setPrizePool(value));
    }, [lotteryContract])

    useEffect(() => {
        if (!owner || !lotteryContract) return;
        lotteryContract.ownerPool().then((value: SetStateAction<number>) => { setOwnerPool(value) });
    }, [owner])

    const handleChange = {
        prize: (event: { target: { value: SetStateAction<undefined>; }; }) => {
            setWithPrize(event.target.value);
        },
        owner: (event: { target: { value: SetStateAction<undefined>; }; }) => {
            setWithOwner(event.target.value);
        }
    }

    const handleClick = {
        prize: async () =>{
            const notification = toast.loading(`Withdrawing ${withdrawPrize} tokens`);
            if(!lotteryContract || !wallet) {
                toast.error('Please connect wallet', {id: notification}); 
                return;
            };
            if(!withdrawPrize) {
                toast.error('Please enter an amount to withdraw', {id: notification});
                return;
            };
            try{
                const tx = await lotteryContract.prizeWithdraw(parseEther(withdrawPrize));
                const receipt = await tx.wait();
                if(receipt.blockNumber){
                    toast.success(`Successfully withdrew ${withdrawPrize} tokens`, {id: notification});
                }else{
                    toast.error(`Something went wrong ${receipt.reason}` , {id: notification});
                }
            }catch (err) {
                toast.error(`Error with processing tx`, {id: notification});
            }
        },
        owner: async () =>{

        }
    }

    return (
        <div className="text-center">
            <h1>Prize pool available to withdraw: {formatEther(prizePool.toString())}</h1>
            <InputField inputType={"number"} placeholder={"amount of tokens to withdraw"} onChange={handleChange.prize} />
            <PrimaryBtn name={"Withdraw Prize"} onClick={handleClick.prize} />
            {owner && 
            (<>
            <h1>Owner pool available to withdraw: {formatEther(ownerPool.toString())}</h1>
            <InputField inputType={"number"} placeholder={"amount of tokens to withdraw"} onChange={handleChange.owner} />
            <PrimaryBtn name={"Withdraw Owner"} />
            </>
            )}
        </ div>)
}

export default WithdrawPrize;