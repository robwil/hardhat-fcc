import { expect } from 'chai';
import { Contract } from 'ethers';
import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { Address } from 'hardhat-deploy/types';
import { FundMe } from '../../typechain-types';

describe('FundMe', () => {
  const sendAmount = ethers.utils.parseEther('1');

  let fundMe: FundMe;
  let deployerAddress: Address;
  let mockV3Aggregator: Contract;
  beforeEach(async () => {
    deployerAddress = (await getNamedAccounts()).deployer;
    await deployments.fixture(['all']);
    fundMe = await ethers.getContract('FundMe', deployerAddress);
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator');
  });

  describe('contructor', () => {
    it('sets the aggregator address correctly', async () => {
      const response = await fundMe.priceFeed();
      expect(response).to.equal(mockV3Aggregator.address);
    });
  });

  describe('FundMe', () => {
    it('Fails if you do not send enough ETH', async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        'Must send at least $50 worth of ETH'
      );
    });
    it('updates amount funded data structure', async () => {
      await fundMe.fund({ value: sendAmount });
      const amountFunded = await fundMe.addressToAmountFunded(deployerAddress);
      expect(amountFunded.toString()).to.equal(sendAmount);
    });
    it('adds funder to array of funders', async () => {
      await fundMe.fund({ value: sendAmount });
      const firstFunderAddress = await fundMe.funders(0);
      expect(firstFunderAddress).to.equal(deployerAddress);
    });
  });
  describe('withdraw', () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendAmount });
    });
    it('withdraw ETH from a single funder', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployerAddress
      );

      // Act
      const txResponse = await fundMe.withdraw();
      const txReceipt = await txResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const totalGasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployerAddress
      );

      // Assert
      expect(startingFundMeBalance).to.equal(sendAmount);
      expect(endingFundMeBalance).to.equal(0);
      expect(endingDeployerBalance).to.equal(
        startingDeployerBalance.add(sendAmount).sub(totalGasCost)
      );
    });
    it('withdraw ETH from multiple funders', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const accounts = await ethers.getSigners();
      for (const account of accounts) {
        const fundMeConnected = await fundMe.connect(account);
        await fundMeConnected.fund({ value: sendAmount });
      }
      const fundMeBalanceAfterAllFunding = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployerAddress
      );

      // Act
      const txResponse = await fundMe.withdraw();
      const txReceipt = await txResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const totalGasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployerAddress
      );

      // Assert balances
      expect(startingFundMeBalance).to.equal(sendAmount);
      expect(fundMeBalanceAfterAllFunding).to.equal(
        sendAmount.mul(accounts.length + 1)
      );
      expect(endingFundMeBalance).to.equal(0);
      expect(endingDeployerBalance).to.equal(
        startingDeployerBalance
          .add(fundMeBalanceAfterAllFunding)
          .sub(totalGasCost)
      );

      // Assert data structures
      await expect(fundMe.funders(0)).to.be.reverted;
      for (const account of accounts) {
        expect(await fundMe.addressToAmountFunded(account.address)).to.equal(0);
      }
    });
    it('prevents non-owner from withdrawing', async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[2];
      const attackerConnectedContract = await fundMe.connect(attacker);
      await expect(
        attackerConnectedContract.withdraw()
      ).to.be.revertedWithCustomError(fundMe, 'FundMe__NotOwner');
    });
  });
});
