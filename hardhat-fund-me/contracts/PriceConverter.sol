// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

library PriceConverter {
  function getPrice(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    // Need to destructure by position to get price
    (
      ,
      /*uint80 roundID*/
      int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
      ,
      ,

    ) = priceFeed.latestRoundData();
    // Chainlink price feed uses 8 decimals, but Wei in msg.value is 18 decimals, so here we multiply by 10^10 to normalize.
    return uint256(price * 1e10);
  }

  function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed); // eth price with 18 decimals
    // always multiply before dividing in Solidity - why?
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountInUsd;
  }
}
