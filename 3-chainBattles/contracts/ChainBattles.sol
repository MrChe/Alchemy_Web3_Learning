// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RandomNumber {
    uint initialNumber;
    function generatePseudoNumber(uint number) public returns(uint){
        return uint(keccak256(abi.encodePacked(initialNumber++))) % number;
    }
}

contract ChainBattles is ERC721URIStorage  {
    using SafeMath for uint256;
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    RandomNumber randomNumberGenerator = new RandomNumber();

    struct Character {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 life;
    }

    mapping(uint256 => Character) public tokenIdToCharacter;

    constructor() ERC721("ChainBattles", "CBTLS") {}

    function getCharacter(uint256 tokenId) public view returns (Character memory) {
        return tokenIdToCharacter[tokenId];
    }

    function isOwner (uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == msg.sender;
    }

    function generateCharacter(uint256 tokenId) public view returns (string memory) {
        Character memory character = getCharacter(tokenId);
        bytes memory svg = abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">Warrior</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">Level: ',character.level.toString(),'</text>',
            '<rect x="10%" y="55%" width="', character.level.mul(5).toString(),'%" height="10" fill="green" />',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">Speed: ',character.speed.toString(),' </text>',
            '<rect x="10%" y="65%" width="', character.speed.mul(5).toString(),'%" height="10" fill="green" />',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">Strength: ',character.strength.toString(),' </text>',
            '<rect x="10%" y="75%" width="', character.strength.mul(5).toString(),'%" height="10" fill="green" />',
            '<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle">Life: ',character.life.toString(),' </text>',
            '<rect x="10%" y="85%" width="', character.life.mul(5).toString(),'%" height="10" fill="green" />',
            '</svg>');
        return string (
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )
        );
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Chain Battles #', tokenId.toString(), '",',
            '"description": "Battles on chain",',
            '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string (
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mint() public {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        tokenIdToCharacter[tokenId] = Character(0,0,0,0);
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(isOwner(tokenId), "You must own this token to train it");
        // get character
        Character memory character = tokenIdToCharacter[tokenId];
        // update character stats
        character.level += 1;
        character.speed += randomNumberGenerator.generatePseudoNumber(5);
        character.strength += randomNumberGenerator.generatePseudoNumber(5);
        character.life += randomNumberGenerator.generatePseudoNumber(5);
        // set new character to tokenId
        tokenIdToCharacter[tokenId] = character;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}