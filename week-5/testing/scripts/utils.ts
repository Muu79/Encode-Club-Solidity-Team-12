import { ethers } from "hardhat";
require("dotenv").config()

export function isAddressValid(address: string) {
  return ethers.utils.isAddress(address)
}

export function fallbackProvider() {
  return new ethers.providers.FallbackProvider([
    new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY),
    new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY),
    new ethers.providers.EtherscanProvider('goerli', process.env.ETHERSCAN_API_KEY),
  ]);
}