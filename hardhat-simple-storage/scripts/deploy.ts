import { ethers, run, network } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to: ${simpleStorage.address}`);
  // programatically verify on Etherscan if on real Goerli testnet
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    // wait for 6 block confirmations to give Etherscan a chance to pick up our contract
    console.log(
      "Waiting for 6 block confirmations before Etherscan verification..."
    );
    await simpleStorage.deployTransaction.wait(6);
    await verifyContract(simpleStorage.address, []);
  } else {
    console.log("Skipping Etherscan verification on local network.");
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue.toString()}`);

  const transactionResponse = await simpleStorage.store("42");
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.favoriteNumber();
  console.log(`Updated value is: ${updatedValue.toString()}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyContract(contractAddress: string, args: any) {
  console.log("Submitting contract for verification to Etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if ((err as Error).message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      throw err;
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
