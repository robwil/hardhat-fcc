// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Imports
import './PriceConverter.sol';

// Errors
error FundMe__NotOwner();

// Contracts

/// @title A contract for crowd funding
/// @author Rob Williams
/// @notice This contract is for demo and testing purposes only.
contract FundMe {
  // Type declarations
  using PriceConverter for uint256;

  // State variables
  mapping(address => uint256) public addressToAmountFunded;
  address[] public funders;

  address public immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 1e18;
  AggregatorV3Interface public priceFeed;

  // Modifiers
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    _;
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    // Address of ETH/USD Goerli contract: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    // From https://docs.chain.link/docs/data-feeds/price-feeds/addresses/#Goerli%20Testnet
    // But we want this to be parameterized so we can easily set up on different chains.
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  /// @notice This function is responsible for funding the contract.
  function fund() public payable {
    // // value is wei, so 1e18 is 1.0 ETH
    // require(msg.value >= 1e18, "At least 1 ETH is required");

    require(
      msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
      'Must send at least $50 worth of ETH'
    );
    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] += msg.value;
  }

  function withdraw() public onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      addressToAmountFunded[funder] = 0;
    }
    funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');
    require(callSuccess, 'Call to transfer ETH failed');
  }
}
