import { MyToken__factory } from "../typechain-types";
import { ethers } from "hardhat";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    //deploy
    let totalGas;
    const [deployer, account1, account2] = await ethers.getSigners();
    const voteContractFactory = new MyToken__factory(deployer);
    const contract = await voteContractFactory.deploy();
    const deployTxRecipt = await contract.deployTransaction.wait();
    console.log(`Deployed contract at block ${deployTxRecipt.blockNumber}`);
    //(deployTxRecipt.gasUsed.mul(deployTxRecipt.effectiveGasPrice)).add(totalGas);
    //mint
    const mintAccount1Tx = await contract.mint(account1.address, MINT_VALUE);
    const mintAccount1TxRecipt = await mintAccount1Tx.wait();
    console.log(`Minted ${ethers.utils.formatUnits(MINT_VALUE, 18)} for ${account1.address} at block ${mintAccount1TxRecipt.blockNumber}`);
    


    //check Power
    let votePowerAccount1 = await contract.getVotes(account1.address);
    console.log(`Account 1 has vote power of ${ethers.utils.formatEther(votePowerAccount1)}`);

    //create checkpoint
    const delegateTxReceipt = await (await contract.connect(account1).delegate(account1.address)).wait();
    console.log(
        `\nTokens delegated from ${account1.address} for ${
          account1.address
        } at block ${delegateTxReceipt.blockNumber}, for a cost of ${
          delegateTxReceipt.gasUsed
        } gas units, totalling a tx cost of ${delegateTxReceipt.gasUsed.mul(
          delegateTxReceipt.effectiveGasPrice
        )} Wei (${ethers.utils.formatEther(
          delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)
        )} ETH)\n`
      );
    //check power again
    votePowerAccount1 = await contract.getVotes(account1.address);
    console.log(`Account 1 now has vote power of ${ethers.utils.formatEther(votePowerAccount1)}`);
    
    
    const mintAccount2Tx = await contract.mint(account1.address, MINT_VALUE);
    const mintAccount2TxRecipt = await mintAccount2Tx.wait();
    console.log(`Minted ${ethers.utils.formatUnits(MINT_VALUE, 18)} for ${account2.address} at block ${mintAccount2TxRecipt.blockNumber}`);
    //what block?
    const currentBlock = await ethers.provider.getBlock("latest");
    console.log(`Current Block ${currentBlock.number}`);
    
    votePowerAccount1 = await contract.getPastVotes(account1.address, currentBlock.number - 1)
   
    
}

main().catch(error => {
    console.log(error);
    process.exitCode = 1;
})