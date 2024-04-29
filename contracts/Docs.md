# Docs

## Contract

The contract is a minimalistic and gas-efficient version of ERC1155 with the `transfer`, `approve`, etc. features stripped out to further reduce the size of the contract for deployment.

But the main interface of ERC1155 for NFT operation is preserved, therefore they are displayed in the user's wallet (MetaMask, TrustWallet) and defined by NFT aggregators (OpenSea)

### ERC1155

The standard is not exactly NFT, but it is possible to use it. Here several people can own one `id`, each `id` has its own metadata, each person gets a token with `id` and with `amount`

## Functions

### `constructor`

Initializes the ERC1155 token with a name and symbol, and sets the contract deployer as the `owner`.

- `_name` Name of the ERC1155 token collection.
- `_symbol` Symbol of the ERC1155 token collection.

### `mint`

Mints a specified amount of tokens to a designated account. Only the `owner` can mint new tokens.

- `to` The address of the recipient.
- `tokenId` The ID of the token to be minted.
- `amount` The amount of the specified token to mint.

#### Example

- `amount = 1` - unique NFT
- `amount = x` - number of points or whatever.

### `batchMint`

Mints batches of tokens to a single recipient. Only the `owner` can execute batch minting.

- `to` The address of the recipient receiving the tokens.
- `tokenIds` An array of token IDs to be minted.
- `amounts` An array of amounts for each token ID being minted.

### `setURI`

Sets or updates the metadata URI for a specific token ID. Only the contract `owner` can call this function to set or update the URI associated with a given token ID.

- `tokenId` The ID of the token whose metadata URI is being set or updated.
- `tokenURI` The new metadata URI that will represent the token's metadata.

#### Example

- Awards
  - `id=0` - first place
  - `id=1` - second place
  - `id=2` - third place
  - `id=4` - diploma for participation.
  - The plus side of this scheme is that in ERC-721 we mint the same pictures for each one that wastes gas, and here we did one time `setURI`, it is cheaper on gas

### `burn`

Burns a specific amount of a token from a given address.
Only the `owner` of the contract can call this function.

- `from` The address from which tokens will be burned.
- `tokenId` The ID of the token to burn.
- `amount` The amount of the token to be burned.

#### Example

Can be used to forfeit an award or withdrawal of course points.

### `batchBurn`

Burns multiple tokens with varying amounts from a given address.
Only the `owner` of the contract can call this function.

- `from` The address from which tokens will be burned.
- `tokenIds` An array of token IDs to burn.
- `amounts` An array of amounts corresponding to each token ID to be burned.

### `transferOwnership`

Transfers ownership of the contract to a new address, or relinquishes ownership if the zero address is passed.
Can only be called by the current `owner`.

- `newOwner` The address to transfer ownership to, or the zero address to relinquish ownership.

## Metadata example

```json
{
  "name": "NFT name, displayed in wallets.",
  "description": "Description, displayed in wallets",
  "image": "Link to the picture, the picture is displayed in the wallets",

  "strength": "The rest goes extra and is optional",
  "attributes": [
    //  is accurately displayed in Trust Wallet
    { "trait_type": "Team", "value": "zkToken" },
    { "trait_type": "Reward", "value": "Finalist" }
  ]
}
```

## Usage

- Deploy contract
- Token minting
  - If an error occurs, you can burn the tokens
- Next, you can give up ownership of the contract so that no one can manipulate the tokens anymore

## Additional scenarios

- **Identity Verification and Document Authentication**

  - Problem: Without SBTs, employers and educational institutions spend a lot of time and resources authenticating academic and professional credentials.
  - Solution: SBTs can serve as reliable digital evidence of professional accomplishments and skills, making the verification process easier and faster.

- **Access to personalized services and privileges**:
  - Problem: Often people trade special points, discounts and coupons, which is sometimes not welcomed by the issuer
  - Solution: SBTs are non-transferable, i.e. if a person has received a coupon/discount, they will not sell it to anyone else
- **SBT for “punishment ”**
  - Problem: Sometimes it is necessary to mark a person as undesirable, but if standard NFTs are used, the user can avoid the “black mark”
  - Solution: Use SBT, since it is not transferable, and then when the person redeems himself, the SBT administrator can burn his token.
