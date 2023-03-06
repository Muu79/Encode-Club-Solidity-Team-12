# Team 12 Week 3 Project - Tokenized Ballot

## Setup

This project uses npm to install dependencies. `npm install`

Wait for it to install, then use `npx hardhat compile`

It also requires you to have a local .env file placed into the source directory with the following format (this can also be found in the .env.example file)

```.env
PRIVATE_KEY="<your private key here if you don't have a mnemonic seed>"
INFURA_API_KEY="********************************"
INFURA_API_SECRET="********************************"
ALCHEMY_API_KEY="********************************"
ETHERSCAN_API_KEY="********************************"
```

You must at minium add your private key and either your infura or alchemy API tokens

## Running scripts

### Hardhat test

```bash
npm run test
```

## Running scripts with arguments

### Deploying a contract with arguments

#### Deploying Token Contract

```bash
npm run deployToken <name> <symbol>
```

#### Depoloying Ballot contract

```bash
npm run deployBallot <token-contract-address> [proposals]
```

replace `[propsals]` with a list of proposals with a space between them

### Giving Voting tokens for right to vote

```bash
npm run giveVotingToken <token-contract-address> [delegatee-addresses]
```

replace `[addresses]` with one or more addresses you would like to give the right to vote.

### Delegating vote

```bash
npm run delegate <token-contract-address> <delegatee-address>
```

### Casting vote

```bash
npm run castVote <ballot-contract-address> <Proposal>
```

replace `<Proposal>` with index of proposal to vote for.

### Querying results

```bash
npm run queryResults <ballot-contract-address>
```

## Report

### Testing

X test conditions tested in `HRE`, before deploying contract to `goerli` net.

![CLI Hardhat Runtime Environment test result screenshot](./docs/test.png 'HRE test result')

### Our Names and Addresses

Muaaz Bhyat - 0xA7951A334F5BfAd8A614a6948454149C9Ce9B162

Stefan Budai - 0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662

Nauman Jabbar - 0xdc32853108f74eA7bFbCF7140605A3353b6532eA

Ahtisham Mehmood - 0xb3E1803709Ec66257a871070161a95850f10DEC7

Kaleb Dori - 0x109Bf5E11140772a1427162bb51e23c244d13b88

Eyassu Birru - 0x60BC23A55918bc761127bC2A7733455d273bac7C

Katya Ryazantseva - 0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE

### Deployment

[Voting Token aka Ice-Cream](https://goerli.etherscan.io/address/0x5eaf4eA4664331BfEAf7a20617F359aB7d5D52A9) was deployed at address 0x5eaf4eA4664331BfEAf7a20617F359aB7d5D52A9 in this [transaction](https://goerli.etherscan.io/tx/0x8ca891ce9f758e41f57fe60dd262a6dab7b814b02a7374882a1e6430e6f3c18b)

[Tokenised Ballot Contract](https://goerli.etherscan.io/address/0xA74291904eEAe2BEBed48a6A636BA1786a1bc1E2) was deployed at address 0xA74291904eEAe2BEBed48a6A636BA1786a1bc1E2 in this [transaction](https://goerli.etherscan.io/tx/0x3ff7d216d588543ecb515b7219ddb192704919bd37b576aea7f42bfde2fe53f5) with four proposals, by Kaleb

### Gave Voting tokens for memeberes

[TODO]

### Delegated Votes

[TODO]

### Voting Power

[TODO]

### Voting

[TODO]

### Results

1. Before a vote is casted the result returns: `No vote has been casted yet`
2. When votes are tie the result is: `it's tie between # members. proposal x, proposal y with vote count of # `
3. When one proposal wins the result returns: `proposal x is winner with # votes`

![Chocolate is winner with 30 votes](./docs/queryResults.png 'CLI winner proposal')

### Gallery

Screenshot for delegating vote.
![CLI delegate call screenshot](./docs/delegation.png 'CLI for delegate vote')

Screenshot for quering voting power.
![CLI voting power call screenshot](./docs/votingPower.png 'CLI for voting power call')

Screenshot for giving voting token.
![CLI give voting token call screenshot](./docs/giveRightToVote.png 'CLI for give voting right')

Screenshot for casting vote.
![CLI casting vote call screenshot](./docs/castVote.png 'CLI for voting')
