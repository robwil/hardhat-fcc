import { network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as helperConfig from '../helper-hardhat-config';
import { verifyContractOnEtherscan } from '../utils/verify';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId || 0;
  const networkConfig = helperConfig.networkConfig[chainId];
  let ethUsdPriceFeed = networkConfig.ethUsdPriceFeed;
  if (networkConfig.needsMocks) {
    // overwrite the dummy ethUsdPriceFeed value with real address of the deployed mock contract
    const mockAggregator = await get('MockV3Aggregator');
    ethUsdPriceFeed = mockAggregator.address;
  }

  const args = [ethUsdPriceFeed];
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig.blockConfirmations || 1,
  });
  if (networkConfig.verifyEtherscan) {
    if (!process.env.ETHERSCAN_API_KEY) {
      log('Skipping Etherscan verification because API key was not present');
    } else {
      await verifyContractOnEtherscan(fundMe.address, args);
    }
  }
  log('----- End of 01-deploy-fund-me ------');
};
export default func;
func.tags = ['all', 'fundme'];
