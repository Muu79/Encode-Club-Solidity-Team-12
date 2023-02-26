import { ethers } from 'hardhat'
import { Ballot__factory } from '../typechain-types'
import { bytesToString, fallbackProvider, isAddressValid } from './utils'
require('dotenv').config()

const { PRIVATE_KEY } = process.env

async function main() {
  const args = process.argv.slice(2)
  const deployedContractAddress = args[0]

  if (!deployedContractAddress || !isAddressValid(deployedContractAddress))
    throw new Error('Invalid Or Missing Required Argument: Contract address')

  if (!PRIVATE_KEY) throw new Error('Missing Private Key')

  const provider = fallbackProvider();

  const wallet = new ethers.Wallet(PRIVATE_KEY)
  const signer = wallet.connect(provider)
  console.log(`Connected to the wallet address ${wallet.address}`)

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
