
import Config from './Config.json'
import { ethers } from 'ethers'

export default class Web3{

    initWeb3(){
        //get provider and signer using either rpc network or injected depending on config
        let provider = null;
        if (Config.isWeb3){
            if(window.ethereum){
                //metamask
                provider = new ethers.providers.Web3Provider(window.ethereum, "any")
                provider.on("network", (_, oldNetwork) => {
                    if (oldNetwork) {
                        //reload on network change
                        window.location.reload();
                    }
                });
          }
        }else{
            //localhost
            provider = new ethers.providers.JsonRpcProvider(Config.provider);
        }
        const signer = provider ? provider.getSigner() : null;
        return {provider, signer}
    }

    metamaskLogin(){
        return new Promise((resolve,reject)=>{
            //prompt user to login to metamask
            if(window.ethereum){
                window.ethereum.request({method:"eth_requestAccounts"})
                .then((accounts)=>{
                    if(accounts.length > 0){
                        resolve(accounts[0])
                    }else{
                        reject("No accounts found from eth_requestAccounts")
                    }
                })
                .catch(err=>reject(err))
            }
        })
    }

    getUserAccount(signer){
        return new Promise((resolve,reject)=>{
            //get account from signer if they are logged in already
            if(signer){
                signer.getAddress()
                .then(addr=>resolve(addr))
                .catch(err=>reject("user not logged in"))
            }else{
                reject("signer is null")
            }
        })
        
    }

    getContract(address, abi, provider){
        //create contract from given address and abi
        return new Promise((resolve,reject)=>{
          if(provider){
                try{
                    const contract = new ethers.Contract(address, abi, provider)
                    resolve(contract)
                }catch(err){
                    reject(err)
                }
          }else{
            reject("web3.getContract provider not set")
          }
        })
    }

}