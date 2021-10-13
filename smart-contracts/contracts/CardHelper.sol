// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;


library CardHelper{
    
    enum CardRarity{
        Common,
        Rare,
        Epic,
        Legendary
    }

    enum CardStats{
        strength,
        cuteness,
        speed,
        lifespan,
        aggression
    }

    struct Card
    {
        string uri;
        string name;
        CardRarity rarity;
        uint16 strength;
        uint16 cuteness;
        uint16 speed;
        uint16 lifespan;
        uint16 aggression;
    }

    /**
     * @dev Compares two cards, returns true if the first card wins
     */
    function fight(Card memory card1, Card memory card2, CardStats stat) internal pure returns(bool){
        bool winCondition = 
            stat == CardStats.strength && card1.strength > card2.strength ||
            stat == CardStats.cuteness && card1.cuteness > card2.cuteness ||
            stat == CardStats.speed && card1.speed > card2.speed ||
            stat == CardStats.lifespan && card1.lifespan > card2.lifespan ||
            stat == CardStats.aggression && card1.aggression > card2.aggression;
        
        if(winCondition){
            return true;
        }else{
            return false;
        }
        
    }

}