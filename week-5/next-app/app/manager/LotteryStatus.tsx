'use client'
import { useConnectWallet } from "@web3-onboard/react"
import { ethers } from "ethers";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as LotteryJson from '../../utils/abi/Lottery.json'
import { InputField, PrimaryBtn } from "../../components/HtmlElements";
import WithdrawPrize from "./WithdrawPrize";


const LotteryStatus = (props : {lotteryAddress?: string}) => {
    const [{ wallet }] = useConnectWallet();
    const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    const [status, setStatus] = useState<boolean>();
    const [owner, setOwner] = useState<boolean>();
    const [close, setClose] = useState<Date>(new Date(Date.now()));
    let {lotteryAddress} = props;
    if(!lotteryAddress) lotteryAddress = process.env.LOTTERY_CONTRACT as string;

    useEffect(() => {
        if (!wallet || !lotteryAddress) return;
        setLotteryContract(new ethers.Contract(lotteryAddress, LotteryJson.abi));
        const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
        setSigner(provider.getSigner());
    }, [wallet])

    useEffect(() => {
        if (!signer || !lotteryContract) return;
        setLotteryContract(lotteryContract.connect(signer));
    }, [signer])

    useEffect(() => {
        if (!lotteryContract) return;
        getStatus();
    }, [lotteryContract])

    const getStatus = async () => {
        if (!lotteryContract || !signer) return false;
        const ownerAddress = await lotteryContract.connect(signer).owner();
        setStatus(await lotteryContract.connect(signer).betsOpen());
        setOwner(ownerAddress.toLowerCase() == (await signer.getAddress()).toLowerCase())
    }

    const openBets = async () => {
        if (!lotteryContract || !signer) {
            console.log('oops'); return;
        };
        const notification = toast.loading(`Opening Lottery till ${close}`)
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
    }

    const closeBets = async () => {
        if (!lotteryContract || !signer) return;
        const notification = toast.loading(`Closing Lottery...`);
        try {
            const tx = await lotteryContract.closeLottery();
            const receipt = await tx.wait();
            if (receipt.blockNumber != undefined) {
                toast.success("Successfully closed Lottery", { id: notification });
                setStatus(false);
            }
        } catch (err : any) {
            console.error(err);
            toast.error(`Failed to close: ${err?.reason}`, { id: notification });
        }
    }

    const handleChange = (event: {
        target: { value: string };
    }) => {
        const future = new Date(event.target.value);
        setClose(future);
        console.log(event.target.value, Math.floor(future.getTime() / 1000));

    };

    return (<>
        <p className="text-xl">Status: Lottery {status ? "Open" : "Closed"}</p>
        {/* show relevant button based on ownership and status*/}
        {!status ?
            (owner && (<div className="w-full text-center">
                <p className="pt-2 mb-0">Date and time lottery should close:</p>
                <InputField inputType={"datetime-local"} placeholder={""} onChange={handleChange} />
                <PrimaryBtn name={"Open Bets"} onClick={openBets} />
            </div>)) :
            (<PrimaryBtn name={'Close Bets'} onClick={closeBets} />)}
            {signer && lotteryContract && owner !== undefined && (<WithdrawPrize lotteryContract={lotteryContract} signer={signer} owner={owner}/>)}
    </>)
}
export default LotteryStatus;