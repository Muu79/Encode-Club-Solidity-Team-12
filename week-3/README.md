# Team 12 Week 3 Tokenized Ballot Project

## Setup

1. Clone the parent directory `week-3` onto your computer.
1. Open a terminal and navigate to where you cloned week-3. run `npm install`
1. Run `npx hardhat compile` from within your terminal
1. Rename `.env.example` to `.env` and edit it with your own relevant details  
   **Note**: we require at minimum your private key as well as either your Infura or Alchemy API keys (but both would be prefrable)

If you're getting a `failed to meet quorum` error. Try using both Alchemy and Infura.

You're all setup to run scripts.

## Running scripts

### Hardhat test

```bash
npm run test
```

## Running scripts with arguments

### Deploying contracts with arguments

**Note**: `<param>` refers to a single value while `[params]` refers to a list of values.  
parameters must be seperated by a space, if your parameter contains a space  
surround it with double-quotes `npm run script param1 "param 2"`

#### Deploying Token Contract

```bash
npm run deployToken <name> <symbol>
```

#### Deploying Ballot contract

```bash
npm run deployBallot <token-contract-address> [proposals]
```

**Note**: you must self-delegate before creating the ballot for voting power to register

replace `[propsals]` with a list of proposals with a space between them

### Giving Voting tokens for right to vote

```bash
npm run giveVotingToken <token-contract-address> <amount> [delegatee-addresses]
```
replace `[delegatee-addresses]` with a list of addresses to mint for.

### Delegating vote

```bash
npm run delegateVote <token-contract-address> <delegatee-address>
```

### Delegating vote by Signature

```bash
npm run delegateBySig <token-contract-address> <delegatee-address> <expiry-date-as-seconds-since-unix-epoch>
```

### Casting vote

```bash
npm run castVote <ballot-contract-address> <Proposal> <amount>
```

replace `<Proposal>` with index of proposal to vote for.

replace `<amount>` with how much power you want to use for your vote.

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

Muaaz Bhyat - [0xA7951A334F5BfAd8A614a6948454149C9Ce9B162](https://goerli.etherscan.io/address/0xa7951a334f5bfad8a614a6948454149c9ce9b162)

Stefan Budai - [0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662](https://goerli.etherscan.io/address/0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662)

Nauman Jabbar - [0xdc32853108f74eA7bFbCF7140605A3353b6532eA](https://goerli.etherscan.io/address/0xdc32853108f74eA7bFbCF7140605A3353b6532eA)

Ahtisham Mehmood - [0xb3E1803709Ec66257a871070161a95850f10DEC7](https://goerli.etherscan.io/address/0xb3E1803709Ec66257a871070161a95850f10DEC7)

Kaleb Dori - [0x109Bf5E11140772a1427162bb51e23c244d13b88](https://goerli.etherscan.io/address/0x109Bf5E11140772a1427162bb51e23c244d13b88)

Eyassu Birru - [0x60BC23A55918bc761127bC2A7733455d273bac7C](https://goerli.etherscan.io/address/0x60BC23A55918bc761127bC2A7733455d273bac7C)

Katya Ryazantseva - [0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE](https://goerli.etherscan.io/address/0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE)

### Deployment

[Voting Token aka Ice-Cream](https://goerli.etherscan.io/address/0x5eaf4eA4664331BfEAf7a20617F359aB7d5D52A9) was deployed at address 0x5eaf4eA4664331BfEAf7a20617F359aB7d5D52A9 in this [transaction](https://goerli.etherscan.io/tx/0x8ca891ce9f758e41f57fe60dd262a6dab7b814b02a7374882a1e6430e6f3c18b) by Muaaz.

[Tokenised Ballot Contract](https://goerli.etherscan.io/address/0xc3B172c55e328E979cf2668C2eeE1c1b399e37D6) was deployed at address 0xc3B172c55e328E979cf2668C2eeE1c1b399e37D6 in this [transaction](https://goerli.etherscan.io/tx/0x90ab4e76e980c11760234eeac4ceed7c9c7a2183918f6ebea435bada8370f570) with four proposals, by Kaleb.

### Gave Voting tokens for members

[Katya received voting tokens](https://goerli.etherscan.io/tx/0x4040e9615bab67b474ad55e2ed87dfdc42a675c48eb54f8fac7de1eecbf1f7bb)

[Eyassu received voting tokens](https://goerli.etherscan.io/tx/0x18da07a8013e8145c83398d1ca3e49cfc7b45c3e5da2b18e43a81d532fea610e)

[Kaleb received voting tokens](https://goerli.etherscan.io/tx/0xe44321190ff74ebfb5d5d2efcd2cb745ba5ea5e00fa5e9122d80b23ffe3d663d)

[Nauman received voting tokens](https://goerli.etherscan.io/tx/0x160bfcb6d34f525ff54680620208668f7bcaceac2cfd493968b62f5eaa94a2e0)

[Stefan received voting tokens](https://goerli.etherscan.io/tx/0x7f73ca0667fee11f14d94def60560296b5983ae15a7d8f30e57e90603d7d4d5a)

[Muaaz received voting tokens](https://goerli.etherscan.io/tx/0x0ee990f03c184709325b18f2d280ad899f80b7d3f50093468cb32d047fd6aa91)

[Ahtisham received voting tokens](https://goerli.etherscan.io/tx/0xdfd366865db6f3bb34800ab24f3cfdf5921505b0535aecda6c4012cd4da29cfa)

### Delegated Votes

#### All users have to perform self-deligation.  

An example can be found [here](https://goerli.etherscan.io/tx/0x8c6d14b65646c15eca552819a1a9c950158047a1060c8160311e23f7452ec9d5) where Muaaz delegates to himself.

### Voting Power

[TODO]

### Voting

#### Muaaz Voted Twice.  
[First Transaction](https://goerli.etherscan.io/tx/0xb7bc139efb3b90d94782f3599d213dff6b99d3c3175b82921ce0abcb77891077) with a value of 1.1 for proposal 1  
[Second Transaction](https://goerli.etherscan.io/tx/0x44e69ddb836c3dad26e07517545108950dfef51ddbeba78d5f5da5c0ea7907e2) with a value of 2.42 for proposal 2  

#### Kaleb Voted Twice.  
[First Transaction](https://goerli.etherscan.io/tx/0x4ff160839bd84fe4478c7ed7e55b48969e7332481a7724b8b6890d3cf5923f77) with a valueof 0.5 for proposal 2

[Second Transaction](https://goerli.etherscan.io/tx/0xe264a2875bf228af04567b717ce623b053e0be84af2beca1d8c4a12e6b748d77) with a valueof 2.9 for proposal 1

#### Eyassu Voted Once.  
[Transaction](https://goerli.etherscan.io/tx/0x578fd4d9711641c534aa57e51124bc58faa30be28f3460b0b04d4797786d4ca9) with a value of 1 for proposal 1  

#### Katya Voted Once.  
[Transaction](https://goerli.etherscan.io/tx/0x6af4356870b19332581dfa5ffdb98c85cbfcb0d1a382a01f4c017ce3fb8c8dff) with a value of 4 for proposal 2  

#### Stefan Voted Once.  
[Transaction](https://goerli.etherscan.io/tx/0x0e2230e5cedd85886034b6711bbba60675af7187c2a7a2113657219b0a0dcc62) with a value of 5 for proposal 0  

### Results

1. Before a vote is casted the result returns: `No vote has been casted yet`
2. When votes are tie the result is: `it's tie between # members. proposal x, proposal y with vote count of # `
3. When one proposal wins the result returns: `proposal x is winner with # votes`

![Coconut is winner with 16.92 votes](./docs/queryResults.png 'CLI winner proposal')

### Gallery

#### Screenshot for giving voting token.  

![CLI give voting token call screenshot](./docs/giveVotingTokens.png 'CLI for minting voting tokens')

#### Screenshot for delegating vote.  

![CLI delegate call screenshot](./docs/delegation.png 'CLI for delegate vote')

#### Screenshot for casting vote.  

![CLI casting vote call screenshot](./docs/castVote.png 'CLI for voting')

#### Screenshot for querying votingPower.

![CLI votePower call screenshot](./docs/votingPower.png 'CLI for voting power query')
