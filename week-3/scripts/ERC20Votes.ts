import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const MINT_VALUE = ethers.utils.parseEther('10');

async function main() {
  const [deployer, account1, account2] = await ethers.getSigners();
  // deploy the contract
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployedTransactionReceipt = await contract.deployTransaction.wait();
  console.log(
    `The tokenized votes contract was deployed at block ${deployedTransactionReceipt.blockNumber}`
  );

  // mint some tokens
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();
  console.log(
    `Tokens minted for ${account1.address} at block ${mintTxReceipt.blockNumber}`
  );

  const tokenBalanceAccount1 = await contract.balanceOf(account1.address);
  console.log(
    `Account 1 has balance of ${ethers.utils.formatEther(
      tokenBalanceAccount1
    )} Vote tokens`
  );

  // check the voting power

  let votePowerAccount1 = await contract.getVotes(account1.address);
  console.log(
    `Account 1 has vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )} units`
  );

  // self delegate
  const delegateTx = await contract
    .connect(account1)
    .delegate(account1.address);
  const delegateTxReceipt = await delegateTx.wait();
  console.log(
    `Tokens delegated from ${account1.address} to ${
      account1.address
    } at block ${delegateTxReceipt.blockNumber} for a cost of ${
      delegateTxReceipt.gasUsed
    } gas units, totaling a tx cost of ${delegateTxReceipt.gasUsed.mul(
      delegateTxReceipt.effectiveGasPrice
    )} Wei (${ethers.utils.formatEther(
      delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)
    )} ETH)`
  );

  votePowerAccount1 = await contract.getVotes(account1.address);
  console.log(
    `Account 1 has now a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )} units`
  );

  // mint some more  tokens for account 2
  const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
  const mintTxReceipt2 = await mintTx2.wait();
  console.log(
    `Tokens minted for ${account2.address} at block ${mintTxReceipt2.blockNumber}`
  );

  const tokenBalanceAccount2 = await contract.balanceOf(account2.address);
  console.log(
    `Account 2 has balance of ${ethers.utils.formatEther(
      tokenBalanceAccount2
    )} Vote tokens`
  );

  // what block I am?
  const currentBlock = await ethers.provider.getBlock('latest');
  console.log(`The current block number is ${currentBlock.number}`);

  // check the historic voting power
  votePowerAccount1 = await contract.getPastVotes(
    account1.address,
    currentBlock.number - 1
  );
  console.log(
    `Account 1 had a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )} units at block ${currentBlock.number - 1}`
  );

  votePowerAccount1 = await contract.getPastVotes(
    account1.address,
    currentBlock.number - 2
  );
  console.log(
    `Account 1 had a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )} units at block ${currentBlock.number - 2}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
