import { ethers } from 'hardhat'
import { Ballot__factory } from '../typechain-types'
require('dotenv').config()

const { INFURA_API_KEY, PRIVATE_KEY } = process.env

function isAddressValid(address: string) {
  return ethers.utils.isAddress(address)
}

function bytesToString(bytes: string) {
  return ethers.utils.parseBytes32String(bytes)
}

async function main() {
  const args = process.argv.slice(2)
  const deployedContractAddress = args[0]

  if (!deployedContractAddress || !isAddressValid(deployedContractAddress))
    throw new Error('Invalid Or Missing Required Arguments')

  if (!PRIVATE_KEY) throw new Error('Missing Private Key')

  const provider = new ethers.providers.InfuraProvider('goerli', INFURA_API_KEY)

  const wallet = new ethers.Wallet(PRIVATE_KEY)
  console.log(`Connected to the wallet address ${wallet.address}`)
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  console.log(`Wallet balance: ${balance} Wei`)

  const ballotContractFactory = new Ballot__factory(signer)
  const contract = ballotContractFactory.attach(deployedContractAddress)

  const winnerName = bytesToString(await contract.winnerName())
  const winnerProposalIndex = await contract.winningProposal()
  const maxVoteCount = (
    await contract.proposals(winnerProposalIndex)
  )?.voteCount?.toNumber();

  if(maxVoteCount === 0) {
    console.log("No vote has been casted yet");
    return ;
  }

  const results: any = {};

  let shouldIterate = true
  let index = 0

  while (shouldIterate) {
    try {
      const proposal = await contract.proposals(index)
      if (proposal.voteCount.toNumber() == maxVoteCount) {
        results[bytesToString(proposal.name)] = proposal.voteCount.toNumber()
      }
    } catch (_) {
      shouldIterate = false
    }

    index += 1
  }

  if (Object.keys(results || {}).length > 1) {
    console.log(
      `it's tie between ${
        Object.keys(results || {}).length
      } members. ${Object.keys(results || {}).join(
        ', ',
      )} with vote count of ${maxVoteCount} `,
    )
  } else {
    console.log(`${winnerName} is winner with ${maxVoteCount} votes`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
