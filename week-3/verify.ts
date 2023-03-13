import { run } from "hardhat";

async function main() {

  const contractAddress = "0x4bD47dAa4f1fee21C97549e4C396A16e58fA6635";
  const contractPathName = "contracts/ERC20Votes.sol:MyToken";
  const contractConstructorArgs = ["IceCream","ICT"];
  
  await run("verify:verify", {
    address: contractAddress,
    contract: contractPathName,
	constructorArguments: contractConstructorArgs,
  });
  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
