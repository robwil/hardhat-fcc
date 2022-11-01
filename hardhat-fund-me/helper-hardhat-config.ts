interface NetworkConfigItem {
  name: string; // friendly name of chain
  ethUsdPriceFeed: string; // address of Chainlink ETH/USD price oracle feed
  needsMocks: boolean; // whether we need to mock Chainlink feed (for dev chains)
  verifyEtherscan: boolean; // whether to use Etherscan API to verify the contract code
  blockConfirmations?: number; // how many block confirmations to wait for after deployments
}

// map from chainId to network-dependent parameters
export const networkConfig: { [key: string]: NetworkConfigItem } = {
  5: {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    needsMocks: false,
    verifyEtherscan: true,
    blockConfirmations: 6, // give Etherscan time to see it
  },
  31337: {
    name: 'hardhat',
    ethUsdPriceFeed: '0x',
    needsMocks: true,
    verifyEtherscan: false,
  },
};

export const CHAINLINK_DECIMALS = 8;
export const CHAINLINK_INITIAL_ANSWER = 2000 * 1e8;
