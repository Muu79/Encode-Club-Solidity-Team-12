import { ethers } from "hardhat";
require("dotenv").config()

export function convertStringArrayToBytes32(array: string[]) {
  return array.map((str) => ethers.utils.formatBytes32String(str))
}

export function isAddressValid(address: string) {
  return ethers.utils.isAddress(address)
}

export function bytesToString(bytes: string) {
  return ethers.utils.parseBytes32String(bytes)
}

export function fallbackProvider() {
  return new ethers.providers.FallbackProvider([
    new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY),
    new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY),
    new ethers.providers.EtherscanProvider('goerli', process.env.ETHERSCAN_API_KEY),
  ]);
}