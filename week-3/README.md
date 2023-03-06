# Team 12 Week 3 Tokenized Ballot Project

## Setup
1. Clone the parent directory `week-3` onto your computer.
1. Open a terminal and navigate to where you cloned week-3. run `npm install`  
1. Run `npx hardhat compile` from within your terminal
1. Rename `.env.example` to `.env` and edit it with your own relevant details  
**Note**: we require at minium your private key as well as either your Infura or Alchemy API keys (but both would be prefrable)

If you're getting a `failed to meet quorum` error. Try using both Alchemy and Infura.

You're all setup to run scripts.

## Running scripts

### Hardhat test

```bash
npm run test
```

## Running scripts with arguments

### Deploying contracts with arguments

#### Deploying Token Contract

```bash
npm run deployToken <name> <symbol>
```

#### Deploying Ballot contract

```bash
npm run deployBallot <token-contract-address> [proposals]
```

replace `[propsals]` with a list of proposals with a space between them

### Giving Voting tokens for right to vote

```bash
npm run giveVotingToken <token-contract-address> [delegatee-addresses] <amount>
```

replace `[addresses]` with one or more addresses you would like to give the right to vote.

### Delegating vote

```bash
npm run delegate <token-contract-address> <delegatee-address>
```

### Delegating vote by Signature

```bash
npm run delegateBySig <token-address> <delegatee-address> <expiry-date-as-seconds-since-unix-epoch>
```

### Casting vote

```bash
npm run castVote <ballot-contract-address> <Proposal>
```

replace `<Proposal>` with index of proposal to vote for.

### Voting Power query

```bash
npm run votingPower <ballot-contract-address> <wallet-address>
```

if `<wallet-address>` is not provided, script will query voting power of `.env` signer address.

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

### Gave Voting tokens for members

[Katya received voting tokens](https://goerli.etherscan.io/tx/0x4040e9615bab67b474ad55e2ed87dfdc42a675c48eb54f8fac7de1eecbf1f7bb)
[Eyassu received voting tokens](https://goerli.etherscan.io/tx/0x18da07a8013e8145c83398d1ca3e49cfc7b45c3e5da2b18e43a81d532fea610e)
[Kaleb received voting tokens](https://goerli.etherscan.io/tx/0xe44321190ff74ebfb5d5d2efcd2cb745ba5ea5e00fa5e9122d80b23ffe3d663d)
[Nauman received voting tokens](https://goerli.etherscan.io/tx/0x160bfcb6d34f525ff54680620208668f7bcaceac2cfd493968b62f5eaa94a2e0)
[Stefan received voting tokens](https://goerli.etherscan.io/tx/0x7f73ca0667fee11f14d94def60560296b5983ae15a7d8f30e57e90603d7d4d5a)
[Muaaz received voting tokens](https://goerli.etherscan.io/tx/0x0ee990f03c184709325b18f2d280ad899f80b7d3f50093468cb32d047fd6aa91)
[Ahtisham received voting tokens](https://goerli.etherscan.io/tx/0xdfd366865db6f3bb34800ab24f3cfdf5921505b0535aecda6c4012cd4da29cfa)
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

Screenshot for giving voting token.
![CLI give voting token call screenshot](./docs/giveVotingTokens.png 'CLI for minting voting tokens')

Screenshot for casting vote.
![CLI casting vote call screenshot](./docs/castVote.png 'CLI for voting')

Screenshot for querying votingPower.
![CLI votePower call screenshot](./docs/votingPower.png 'CLI for voting power query')
