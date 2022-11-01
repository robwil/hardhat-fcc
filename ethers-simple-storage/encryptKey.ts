import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  const rawPrivateKey = process.env.RAW_PRIVATE_KEY;
  if (!rawPrivateKey) {
    throw new Error("Must specify RAW_PRIVATE_KEY via environment file");
  }
  const passwordForEncryption = process.env.PRIVATE_KEY_PASSWORD;
  if (!passwordForEncryption) {
    throw new Error("Must specify PRIVATE_KEY_PASSWORD via environment file");
  }
  const wallet = new ethers.Wallet(rawPrivateKey);
  const encryptedJsonKey = await wallet.encrypt(
    passwordForEncryption,
    rawPrivateKey
  );
  fs.writeFileSync("./encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
