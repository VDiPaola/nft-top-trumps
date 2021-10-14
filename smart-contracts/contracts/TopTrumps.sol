// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/Counters.sol';
import './CardHelper.sol';
import "hardhat/console.sol";

contract TopTrumps is ERC721, ERC721Burnable, Ownable {
    constructor() ERC721("TopTrumps", "TT") {}
    using CardHelper for CardHelper.Card;
    using Counters for Counters.Counter;

    Counters.Counter private tokenId;

    event CardCreated(string uri, string name, uint16 strength, uint16 cuteness, uint16 agility, uint16 lifespan, uint16 aggression);
    event PackOpened(address from, uint timestamp);

    CardHelper.Card[] cards;

    mapping(uint => CardHelper.Card) tokens;
    mapping(address => CardHelper.Card[]) userTokens;

    function createCard(string memory uri,string memory name, uint16 strength, uint16 cuteness, uint16 agility, uint16 lifespan, uint16 aggression) public
    {
        CardHelper.Card memory card = CardHelper.Card(uri, name, CardHelper.CardRarity.Common, strength, cuteness, agility, lifespan, aggression);
        cards.push(card);

        emit CardCreated(uri, name, strength, cuteness, agility, lifespan, aggression);
    }

    function buyPack() public payable{
        emit PackOpened(msg.sender, block.timestamp);
        for(uint i=0;i < 5;i++){
            CardHelper.Card memory card = _mintCard(tokenId.current());
            tokens[tokenId.current()] = card;
            userTokens[msg.sender].push(card);
            _safeMint(msg.sender, tokenId.current());
            tokenId.increment();
        }
    }

    function _mintCard(uint _nonce) private view returns(CardHelper.Card memory){
        //random number to decide rarity
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty, _nonce))) % 1000;
        CardHelper.CardRarity rarity = CardHelper.CardRarity(0);
        if(randomNumber > 900){
            rarity = CardHelper.CardRarity(1);
        }else if(randomNumber > 700){
            rarity = CardHelper.CardRarity(2);
        }else if(randomNumber > 550){
            rarity = CardHelper.CardRarity(3);
        }
        //get random card
        uint randomNumber2 = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty, _nonce))) % cards.length;
        CardHelper.Card memory card = cards[randomNumber2];
        card.rarity = rarity;
        return card;
    }

    function getCards() external view returns(CardHelper.Card[] memory){
        CardHelper.Card[] memory cardsArray = cards;
        return cardsArray;
    }

    function getTokens() external view returns(CardHelper.Card[] memory){
        CardHelper.Card[] memory cardArray = userTokens[msg.sender];
        return cardArray;
    }


    function safeMint(address _to, uint256 _tokenId) public onlyOwner {
        _safeMint(_to, _tokenId);
    }
}