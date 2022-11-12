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
  mapping(address => uint256) private s_addressToAmountFunded;
  address[] private s_funders;

  address private immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 1e18;
  AggregatorV3Interface public s_priceFeed;

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
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
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
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      'Must send at least $50 worth of ETH'
    );
    s_funders.push(msg.sender);
    s_addressToAmountFunded[msg.sender] += msg.value;
  }

  function withdraw() public onlyOwner {
    // copying s_funders into funders reduces the amount of SLOAD gas needed
    // (offers gas savings as long as funders.length > 1)
    address[] memory funders = s_funders;
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');
    require(callSuccess, 'Call to transfer ETH failed');
  }

  // View/Pure functions

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAmountFundedByAddress(address funder)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[funder];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
