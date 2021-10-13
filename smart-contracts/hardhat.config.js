require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    ganache:{
      url:"http://127.0.0.1:7545",
      acccounts: ["746041e78c43e0d01ca46485e13713ce54257da095ef80e576d8e2ca1b14a325"]
    }
  }
};
