'use client'

import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import * as lotteryJson from '../utils/abi/Lottery.json'

const PrizePool =  () =>{
    const [{wallet}] = useConnectWallet();
    const [pool, setPool] = useState<ethers.BigNumberish>();
    useEffect(()=>{
        if(!wallet) return;
    const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
    const signer = provider.getSigner();
    const lotteryAddress = process.env.LOTTERY_CONTRACT as string;
    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryJson.abi, signer);
    lotteryContract.prizePool().then( (value:ethers.BigNumber) => {setPool(value)});
    }, [wallet])

    return(<>
        {pool && (<p>{pool.toString()} Tokens</p>)}
    </>)
}

export default PrizePool;