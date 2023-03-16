# Team 12 Week 4 Voting Dapp

## Architecture

The Voting Dapp consists of the frontend and the backend part. The frontend part is implemented on NextJS. The backend is on NestJS. Users' transactions are signed by Metamask Wallet browser plugin.

The Dapp interacts with two smart contracts: a token contract and a ballot contract. You can use the token contract as a standard ERC20 token or you can vote with your tokens.

## Setup and running servers

Clone the parent directory `week-4` onto your computer.

### Frontend

Install the frontend part.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:4200](http://localhost:4200)

### Backend

Install the backend part.

```bash
cd ../backend
npm install
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000)

**Note**: we require minter's private key and your Alchemy API key. Put them in `backend/.env` file.

## Smart contracts

The smart contracts are in the `week-4/contracts` folder.

[Voting Token aka Ice-Cream](https://goerli.etherscan.io/address/0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635) was deployed at address 0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635 in this [transaction](https://goerli.etherscan.io/tx/0xf8f0dfc66e3002df178bd2eef134df479334184969707f08b09d47252d0d273a) by Kaleb.

[Tokenised Ballot Contract](https://goerli.etherscan.io/address/0x9B93774789584f3c665202Ee0609dDEfF5Cfee30) was deployed at address 0x9B93774789584f3c665202Ee0609dDEfF5Cfee30 in this [transaction](https://goerli.etherscan.io/tx/0xfd8d94652789958cacf5b82183cbbf05d66dbeb25af6d1fb42ec27a55280ee53) with four proposals, by Stephan.

## Report

## Frontend

### Connecting wallet

Install Metamask wallet and login. Press connect wallet to plug your wallet to the Dapp.

### Minting voting tokens

![Request minting token](./docs/request_tokens.png 'Request voting tokens')

Enter tokens amount in ether and press Request tokens.

### Delegating vote

To vote with your tokens, you need to self-delegate. Put your wallet address into Delegate and press Delegate Vote.

![Delegating vote](./docs/delegate.png 'Delegate vote')

> **NOTE:**
> If address field is left blank, you will be self-delegating.

You can delegate all your voting tokens to another voter. Insert a new voter address into Delegate input and press Delegate Vote.

### Casting vote

![Cast vote](./docs/cast_vote.png 'Casting vote')

Choose the voting proposal by index from 0 to 3 and press Cast Vote.

### Querying results

![Results](./docs/query_result.png 'Display results')

![Winner](./docs/winner.png 'Winning proposal display')

### Recent votes

![Recent vote](./docs/recent_votes.png 'Display of recent vote')

## Backend

### Minting voting tokens

For minting `POST` method mint() is implemented on the server side. Send a voter's address and amount of tokens in ether as params.

http://localhost:3000/api#/default/AppController_mint

Request params (JSON file):

```json
{ "to": "voter_address", "amount": 10 }
```

If transaction is confirmed, the API returns `Completed`, the other way it gives `Reverted`.
Result:

```json
{ "res": "Completed" }
```

### Delegating vote

For delegate `POST` method delegate() is implemented on the server side. Send a delegatee address as param.

http://localhost:3000/api#/default/AppController_delegate

Request params (JSON file):

```json
{ "to": "delegatee_address" }
```

The API returns the unsigned hash and voting token contract address.
Result:

```json
{
  "address": "token_contract",
  "unsignedHash": "0x..."
}
```

### Casting vote

For casting vote `POST` method castVote() is implemented on the server side. Send a ballot address, proposal index and voting power as param.

http://localhost:3000/api#/default/AppController_castVote

Request params (JSON file):

```json
{
  "ballotAddress": "ballot_contract",
  "proposal": "<proposal_index>",
  "amount": "<amount_in_ethers>"
}
```

The API returns the unsigned hash and voting ballot contract address.
Result:

```json
{
  "address": "ballot_contract",
  "unsignedHash": "0x..."
}
```

### Querying results

For querying results `GET` method winningProposal() is implemented on the server side. Send a ballot contract address as query.

http://localhost:3000/api#/default/AppController_winningProposal

The API returns the winning proposal's index, name and vote count.
Result:

```json
{
  "winnerProposalIndex": "<proposal_index>",
  "winnerProposalName": "<proposal_name>",
  "winnerVotecount": "<vote_count>"
}
```

### Recent votes

For recent vote `GET` method getRecentVotes() is implemented on the server side. No query or param is sent.

http://localhost:3000/api#/default/AppController_recentVotes

The API returns the recent votes casted.
Result:

```json
[
  {
    "proposalName": "<proposal_name>",
    "amountVoted": "<vote_count>",
    "totalVotes": "<total_vote_count>"
  }
]
```

### Query proposals

For query proposals `GET` method getProposals() is implemented on the server side. Send a ballot contract address as query.

http://localhost:3000/api#/default/AppController_getProposals

The API returns the target block munber and proposals of the ballot contract address.
Result:

```json
{
  "targetBlockNumber": "<block_number>",
  "proposals": [
    {
      "name": "<proposal_name>",
      "votes": "<vote_count>"
    }
  ]
}
```

### Query voting power

For query voting power `GET` method votingPower() is implemented on the server side. Send a ballot contract address and voter's address as query.

http://localhost:3000/api#/default/AppController_votingPower

The API returns the voting power and spent voting power of the voter's address.
Result:

```json
{
  "votingPower": "<amount>",
  "votingPowerSpent": "<amount>"
}
```

## Gallery

#### Screenshot for frontend.

![Frontend screen light theme](./docs/frontend.png 'Light theme frontend for Voting dapp')

#### Screenshot for Metamask.

![Metamask connection](./docs/connect_metamask.png 'Metamask connect via onboard')

#### Screenshot for backend API

![Backend](./docs/backend.png 'Swagger for backend')
