import { ethers } from "hardhat";

export function convertStringArrayToBytes32(array: string[]) {
    return array.map((str) => ethers.utils.formatBytes32String(str))
  }