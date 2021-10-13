// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/Counters.sol';
import './CardHelper.sol';

contract TopTrumps is ERC721, ERC721Burnable, Ownable {
    constructor() ERC721("TopTrumps", "TT") {}
    using CardHelper for CardHelper.Card;
    using Counters for Counters.Counter;

    Counters.Counter private tokenId;

    event cardCreated(string uri, string name, uint16 strength, uint16 cuteness, uint16 agility, uint16 lifespan, uint16 aggression);

    CardHelper.Card[] cards;

    mapping(uint => CardHelper.Card) tokens;

    function createCard(string memory uri,string memory name, uint16 strength, uint16 cuteness, uint16 agility, uint16 lifespan, uint16 aggression) public
    {
        CardHelper.Card memory card = CardHelper.Card(uri, name, CardHelper.CardRarity.Common, strength, cuteness, agility, lifespan, aggression);
        cards.push(card);

        emit cardCreated(uri, name, strength, cuteness, agility, lifespan, aggression);
    }

    function buyPack() public payable{
        //random number to decide rarity
    }

    function getCards() external view returns(CardHelper.Card[] memory){
        CardHelper.Card[] memory cardsArray = cards;
        return cardsArray;
    }
    function getToken(uint _id) external view returns(CardHelper.Card memory){
        CardHelper.Card memory card = tokens[_id];
        return card;
    }


    function safeMint(address _to, uint256 _tokenId) public onlyOwner {
        _safeMint(_to, _tokenId);
    }
}