# Team 12 Week 2 Ballot Project

## Setup

This project uses npm to install dependencies. `npm install`

Wait for it to install, then use `npx hardhat compile`

It also requires you to have a local .env file placed into the source directory with the following format (this can also be found in the .env.example file)

```.env
MNEMONIC="here is where your twelve words mnemonic should be put my friend"
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

```bash
npm run deploy [proposals]
```
replace `[propsals]` with a list of proposals with a space between them

### Giving right to vote

```bash
npm run giveRight <contract-address> [addresses]
```
replace `[addresses]` with one or more addresses you would like to give the right to vote.

### Delegating vote

```bash
npm run delegate <contract-address> <address> 
```

### Casting vote

```bash
npm run castVote <contract-address> <Proposal>
```

### Querying results

```bash
npm run queryResults <contract-address>
```

## Report

### Our Names and Addresses

Muaaz Bhyat - 0xA7951A334F5BfAd8A614a6948454149C9Ce9B162

Stefan Budai - 0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662

Nauman Jabbar - 0xdc32853108f74eA7bFbCF7140605A3353b6532eA

Ahtisham Mehmood - 0x17d9bb657c98F9e6444735E05926F47B5B8332cE

Kaleb Dori - 0x109Bf5E11140772a1427162bb51e23c244d13b88

Eyassu Birru - 0x60BC23A55918bc761127bC2A7733455d273bac7C

Katya Ryazantseva - 0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE
