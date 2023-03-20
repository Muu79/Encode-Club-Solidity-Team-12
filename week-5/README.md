# Team 12 Week 5 Lottery Dapp

## Architecture

![Team 12 Lottery Dapp](./docs/display.png 'Lottery Dapp')

Overall, this design concept seeks to create a sense of excitement around the lottery system, using dynamic animations and sound to capture the attention and imagination of users.

The Dapp interacts with two smart contracts: a token contract and a lottery contract. You can use the token contract as a standard ERC20 token or you can place bets with your tokens.

## Setup and running servers

Clone the parent directory `week-5` onto your computer.

### Dapp

Install the lottery dapp.

```bash
cd next-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Smart contracts

The smart contracts are in the `week-5/testing/contracts` folder.

[Lottery Contract](https://goerli.etherscan.io/address/0xac26890F3f57596dF13C3087ff3D40b21E57D9D0) was deployed at address 0xac26890F3f57596dF13C3087ff3D40b21E57D9D0 in this [transaction](https://goerli.etherscan.io/tx/0x5b0e06f0b472203aa0badbb042d8a1121b9dae3a6a020682f2e2a589a02d3111) with four proposals, by Stephan.

[Lottery Token](https://goerli.etherscan.io/address/0xdb27124742C979901Cf731aF6C9F863A626e956C) was deployed at address 0xdb27124742C979901Cf731aF6C9F863A626e956C by `Lottery Contract`.

## Report

### Connecting wallet

Install Metamask wallet and login. Press connect wallet to plug your wallet to the Dapp.

### Purchase lottery tokens

![Purchase lottery token](./docs/purchase_tokens.png 'Purchase Lottery tokens')

Enter tokens amount and press Request tokens.

### Place Bet

![Place token for Bet](./docs/bet.png 'Place token for Bet')

### Burn Lottery token

![Burn token](./docs/burn_token.png 'Burning token')
