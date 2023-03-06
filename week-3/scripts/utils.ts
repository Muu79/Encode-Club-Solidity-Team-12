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

export async function fallbackProvider() {
  try {
    const provider = new ethers.providers.FallbackProvider([
      new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY),
      new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY),
      new ethers.providers.EtherscanProvider('goerli', process.env.ETHERSCAN_API_KEY),
    ]);
    await provider.getNetwork();
    return provider;
  }catch (error) {
    console.error(`Failed to connect to fallback provider: ${error}`);
    throw new Error(`ETH Error: Please make sure your Infura or Alchemy API Keys are valid`);
  }
}

export function isPrivateKey(privateKey: string) {
  if(!privateKey.match(/^0x/)){
    privateKey = "0x" + privateKey;
  }
  return ethers.utils.isHexString(privateKey, 32);
}