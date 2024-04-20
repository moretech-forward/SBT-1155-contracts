// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "./ERC1155/ERC1155.sol";
import {Owned} from "./Owned.sol";

contract Soulbound is ERC1155, Owned {
    string public name;
    string public symbol;

    constructor(
        string memory _name,
        string memory _symbol
    ) payable ERC1155() Owned(msg.sender) {
        name = _name;
        symbol = _symbol;
    }

    function mint(
        address account,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        _mint(account, tokenId, amount, "");
    }

    function setURI(uint256 tokenId, string memory tokenURI) external {
        _setURI(tokenId, tokenURI);
    }

    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external onlyOwner {
        _batchMint(to, tokenIds, amounts, "");
    }
}
