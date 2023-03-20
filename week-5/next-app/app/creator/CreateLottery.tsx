'use client'

import { InputField, PrimaryBtn } from "@/components/HtmlElements";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { useState } from "react";

const CreateLottery = () => {
    const [{ wallet }] = useConnectWallet();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    const [created, setCreated] = useState();
    const [lotteryCloner, setLotteryCloner] = useState();
    const [newLottery, setNewLottery] = useState();
    const [tokenName, setTokenName] = useState<string>();
    const [tokenSymbol, setTokenSymbol] = useState<string>();

    
    



    return (<>
        {!created ?
            (<>
                <h1>Create Lottery</h1>
                <InputField inputType={"text"} placeholder={"Name of token to be created"} className="w-full"/>
                <InputField inputType={"text"} placeholder={"Symbol for token eg. MYT"} />
                <InputField inputType={"number"} placeholder={"Number of tokens per Eth spent"} className='inline-flex' />
                <InputField inputType={"number"} placeholder={"Price per bet (in tokens)"} />
                <InputField inputType={"number"} placeholder={"House fee (in tokens)"} />
                <PrimaryBtn name={"Create Lottery"} />
            </>) :
            (<>
                <h1>Lottery Details</h1>
                <h2>Lottery Address: {}</h2>
                <h2>Lottery Token Address: {}</h2>
            </>)}
    </>)
};

export default CreateLottery;