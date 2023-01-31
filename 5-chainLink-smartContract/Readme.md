# Instruction To work with Chainlink

1. Create contract with 2 methods `performUpkeep` and `checkUpkeep`.
2. Mint NFT, need to call method `safeMint` with `to` address.
3. Important to run IPFS node to serve folder `ipfs` with all json data for `bears` and `bulls`.
4. Register `Upkeep` https://docs.chain.link/chainlink-automation/register-upkeep with Trigger `Custom logic` because we use `checkUpkeep` and `performUpkeep` methods.
   - `Target contract address` - put contract address.
   - `Upkeep name` - any name its for just you.
   - `Check data` - put `0x` or empty because we use `checkUpkeep` method.
   - `Project name` - any name its for just you.
5. After creating `Upkeep` need little bit wait 5-10 minutes.
6. Change interval inside contract to 600 for example, need to call method `setInterval`, its need to change just for saving LINK.
7. Create and fund a VRF subscription https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number
    - After Creating you will see new subscription, copy `Subscription ID` and put it inside contract, need to call method `setSubscriptionId`.
    - Enter to new subscription and add new `Consumer` (its your smart contract address).
    - Copy `VRF Coordinator address` and put it inside contract, need to call method `setVrfCoodinator`.
8. Change PriceFeed https://docs.chain.link/data-feeds/price-feeds/addresses/?network=ethereum 
    - Copy `Aggregator address` and put it inside contract, need to call method `setPriceFeed`.
9. Check OpenSea after 1-2 hours, you will see some changes.