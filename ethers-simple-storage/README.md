Lesson 5 project: https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-5-ethersjs-simple-storage

## How to run

```bash
# compile solidity
yarn compile
# deploy and interact with contract
yarn run ts-node deploy.ts
```

## Creating encryptedKey.json
Put your `PRIVATE_KEY_FOR_DEV` and `PRIVATE_KEY_PASSWORD` in `.env`. Run `ts-node encryptKey.ts`. Then you can remove `PRIVATE_KEY_FOR_DEV` and `PRIVATE_KEY_PASSWORD` from the `.env` and the encrypted json will be used from then on. You will need to specify `PRIVATE_KEY_PASSWORD` from CLI (and remember to clear history!).

## Safety pledge
For the purpose of this course, all private keys will be testnet or local blockchain keys ONLY. We do some basic encryption to demonstrate best practices, but we will often take shortcuts that will leave the keys open to compromise (e.g. not clearing bash history, or putting raw private keys in `.env`).

See: https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/5