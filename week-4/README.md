# Team 12 Week 4 Voting Dapp

## Architecture

The Voting Dapp consists of the frontend and the backend part. The frontend part is implemented on NextJS. The backend is on NestJS. Users' transactions are signed by Metamask Wallet browser plugin.

The Dapp interacts with two smart contracts: a token contract and a ballot contract. You can use the token contract as a standard ERC20 token or you can vote with your tokens.  

## Setup and running servers

Clone the parent directory `week-4` onto your computer.

### Frontend

Install the frontend part.
```
cd frontend
npm install
npm run dev
```
Open http://localhost:4200

### Backend

Install the backend part.
```
cd ..
cd backend
npm install
npm run start:dev
```
Open http://localhost:3000

   **Note**: we require minter's private key and your Alchemy API key. Put them in `backend/.env` file.

## Smart contracts

The smart contracts are in the `week-4/contracts` folder. 

[Voting Token aka Ice-Cream](https://goerli.etherscan.io/address/0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635) was deployed at address 0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635 in this [transaction](https://goerli.etherscan.io/tx/0xf8f0dfc66e3002df178bd2eef134df479334184969707f08b09d47252d0d273a) by Kaleb.

[Tokenised Ballot Contract](https://goerli.etherscan.io/address/0x9B93774789584f3c665202Ee0609dDEfF5Cfee30) was deployed at address 0x9B93774789584f3c665202Ee0609dDEfF5Cfee30 in this [transaction](https://goerli.etherscan.io/tx/0xfd8d94652789958cacf5b82183cbbf05d66dbeb25af6d1fb42ec27a55280ee53) with four proposals, by Stephan.

## Report

### Our Names and Addresses

Muaaz Bhyat - [0xA7951A334F5BfAd8A614a6948454149C9Ce9B162](https://goerli.etherscan.io/address/0xa7951a334f5bfad8a614a6948454149c9ce9b162)

Stefan Budai - [0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662](https://goerli.etherscan.io/address/0xd7a1E69dBAfeba459d15D9a040Af8938c47A3662)

Nauman Jabbar - [0xdc32853108f74eA7bFbCF7140605A3353b6532eA](https://goerli.etherscan.io/address/0xdc32853108f74eA7bFbCF7140605A3353b6532eA)

Ahtisham Mehmood - [0xb3E1803709Ec66257a871070161a95850f10DEC7](https://goerli.etherscan.io/address/0xb3E1803709Ec66257a871070161a95850f10DEC7)

Kaleb Dori - [0x109Bf5E11140772a1427162bb51e23c244d13b88](https://goerli.etherscan.io/address/0x109Bf5E11140772a1427162bb51e23c244d13b88)

Eyassu Birru - [0x60BC23A55918bc761127bC2A7733455d273bac7C](https://goerli.etherscan.io/address/0x60BC23A55918bc761127bC2A7733455d273bac7C)

Katya Ryazantseva - [0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE](https://goerli.etherscan.io/address/0x4C2A233B9fA760ffDC12703242Fb3D0855334DFE)


## Frontend

### Connecting wallet

Install Metamask wallet and login. Press connect wallet to plug your wallet to the Dapp.

### Minting voting tokens

Enter tokens amount in ether and press Request tokens.

### Giving Voting tokens for right to vote

To vote with your tokens, you need to self-delegate. Put your wallet address into Delegate and press Delegate Vote.

### Delegating vote

You can delegate all your voting tokens to another voter. Insert a new voter address into Delegate input and press Delegate Vote.

### Casting vote

Choose the voting proposal by index from 0 to 3 and press Cast Vote.

### Querying results

## Backend

### Minting voting tokens

For minting POST method mint() is implemented on the server side. Send a voter's address and amount of tokens in ether as params.

http://localhost:3000/api#/default/AppController_mint

Request params (JSON file): 

```
{"to":"voter_address","amount":10}
```
If transaction is confirmed, the API returns `Completed`, the other way it gives `Reverted`.
Result:

```
Completed
```

### Giving Voting tokens for right to vote

### Delegating vote

### Casting vote

### Querying results

#### All users have to perform self-deligation.  

## Voting Results


## Gallery

#### Screenshot for frontend. 

#### Screenshot for Metamask. 

#### Screenshot for backend API GET method.  

#### Screenshot for backend API Post method. 


