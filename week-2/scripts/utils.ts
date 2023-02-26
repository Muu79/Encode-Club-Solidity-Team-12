import { ethers } from "hardhat";

export function convertStringArrayToBytes32(array: string[]) {
  return array.map((str) => ethers.utils.formatBytes32String(str))
}

export function isAddressValid(address: string) {
  return ethers.utils.isAddress(address)
}

export function bytesToString(bytes: string) {
  return ethers.utils.parseBytes32String(bytes)
}