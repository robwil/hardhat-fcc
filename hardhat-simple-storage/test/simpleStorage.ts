import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", function () {
  let simpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });
  it("should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue.toString()).to.equal("0");
  });
  it("should update when we call store", async () => {
    const transactionResponse = await simpleStorage.store("42");
    await transactionResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue.toString()).to.equal("42");
  });
});
