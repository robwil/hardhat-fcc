import { expect } from 'chai';
import { Contract } from 'ethers';
import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { FundMe } from '../../typechain-types';

describe('FundMe', () => {
  let fundMe: FundMe;
  let deployerAddress;
  let mockV3Aggregator: Contract;
  beforeEach(async () => {
    deployerAddress = (await getNamedAccounts()).deployer;
    await deployments.fixture(['all']);
    fundMe = await ethers.getContract('FundMe', deployerAddress);
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator');
  });

  describe('contructor', async () => {
    it('sets the aggregator address correctly', async () => {
      const response = await fundMe.priceFeed();
      expect(response).to.equal(mockV3Aggregator.address);
    });
  });
});
