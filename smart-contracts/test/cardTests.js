const { expect } = require("chai"); //Chai Here BLyat :>)
const { ethers } = require("hardhat");

describe("TopTrumps", async function(){
  let topTrumps;

  beforeEach(async ()=>{
    const TopTrumps = await hre.ethers.getContractFactory("TopTrumps");
    topTrumps = await TopTrumps.deploy();
    await topTrumps.deployed();
  })

  it("attempt to create a card", async function () {
    // Name, Rarity, Strength, Cuteness, Agility, Lifespan, Aggression
    expect(await topTrumps.createCard("uri","peter", 100, 50, 200, 150, 20))
    .to.emit(topTrumps, "cardCreated")

    const waitForEvent = false
    if(waitForEvent){
      return new Promise((resolve,reject)=>{
        topTrumps.on("cardCreated", (id,uri,name, strength, cuteness, agility, lifespan, aggression)=>{
          console.log(`id:${id}\nname:${name}\nuri:${uri}\nstrength:${strength}\ncuteness${cuteness}\nagility:${agility}\nlifespan:${lifespan}\naggression:${aggression}`)
          resolve()
        })
      })
    }
  });

  it("attempt to get card by id", async function () {
    var id = 1;
    //create card
    expect(await topTrumps.createCard("uri","peter", 100, 50, 200, 150, 20))
    .to.emit(topTrumps, "cardCreated")
    //get card
    const cards = await topTrumps.getCards()
    const card = cards[0]
    //expect values match
    expect(card.name).to.equal("peter")
    expect(card.strength).to.equal(100)
  });


});
