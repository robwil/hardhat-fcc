import { run } from 'hardhat';

export async function verifyContractOnEtherscan(
  contractAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any
) {
  console.log('Submitting contract for verification to Etherscan...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if ((err as Error).message.toLowerCase().includes('already verified')) {
      console.log('Already verified!');
    } else {
      throw err;
    }
  }
}
