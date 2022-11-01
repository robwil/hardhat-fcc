import { network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as helperConfig from '../helper-hardhat-config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId || 0;
  const networkConfig = helperConfig.networkConfig[chainId];
  if (networkConfig.needsMocks) {
    log('Network config requested mocks! Deploying mocks...');
    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      log: true,
      args: [
        helperConfig.CHAINLINK_DECIMALS,
        helperConfig.CHAINLINK_INITIAL_ANSWER,
      ],
    });
    log('Mocks deployed!');
    log('------- End of 00-deploy-mocks ------');
  }
};
export default func;
func.tags = ['all', 'mocks'];
