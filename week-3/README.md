# Team 12 Week 3 Tokenized Ballot Project

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

## Deploying contracts

### Deploy token contract

```bash
npm run deployToken name symbol
```

### Deploy ballot contract

```bash
npm run deploy [propsals]
```
replace `[propsals]` with a list of proposals with a space between them

### Delegating vote

Before you start voting, you need to self-delegate your tokens. 

```bash
npm run delegate <contract-address> <address>
```
### Delegating vote by Signature

```bash
npm run delegateBySig <token-address> <delegatee-address> <expiry-date-as-seconds-since-unix-epoch>
```
