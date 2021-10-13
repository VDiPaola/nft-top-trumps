
import React from "react";
import {Stack, Button, Spinner} from 'react-bootstrap'

import Web3 from "../web3";

import {NFTStorage, File} from 'nft.storage'

import Config from '../Config.json'


const NFT_API = process.env.REACT_APP_NFT_STORAGE_KEY
const nftStorageClient = new NFTStorage({ token: NFT_API })


export class CreateCard extends React.Component{
    constructor(props){
        super(props)
        const web3 = new Web3()
        const {provider,signer} = web3.initWeb3()
        this.state = {
            image:null,
            name:"",
            strength:0,
            cuteness:0,
            agility:0,
            lifespan:0,
            aggression:0,

            web3,
            provider,
            signer,
            contract:null,
            userAccount:null,
            networkName:null,

            spinner:false
        }

    }

    componentDidMount(){
        //get network name
        this.state.provider.getNetwork().then(network=>{
            this.setState({networkName:network.name})
        })
        //get account if logged in
        this.state.web3.getUserAccount(this.state.signer)
        .then(account=>{
            this.setState({userAccount:account})
        })
        .catch(err=>{
            console.log(err)
            //prompt user to login to metamask
            this.metamaskLogin()
        })
        //get contract
        this.state.web3.getContract(Config.contract.address, Config.contract.abi, this.state.signer)
        .then(contract=>{
            this.setState({contract})
        })
        .catch(err=>console.log(err))
    }

    onImageChange(event){
        this.setState({image:event.target.files[0]})
    }
    onNameChange(event){
        this.setState({name:event.target.value})
    }
    onStrengthChange(event){
        this.setState({strength:event.target.value})
    }
    onCutenessChange(event){
        this.setState({cuteness:event.target.value})
    }
    onAgilityChange(event){
        this.setState({agility:event.target.value})
    }
    onLifespanChange(event){
        this.setState({lifespan:event.target.value})
    }
    onAggressionChange(event){
        this.setState({aggression:event.target.value})
    }

    handleClick(event){
        //upload to ipfs then createCard
        this.setState({spinner:true})
        nftStorageClient.store({
            name:this.state.name,
            description:"TopTrump image",
            image: new File([this.state.image], this.state.image.name, { type: this.state.image.type })
        })
        .then(res=>{
            const url = res.data.image.href
            this.createCard(url, this.state.name, this.state.strength,this.state.cuteness,this.state.agility,this.state.lifespan,this.state.aggression)
        })
        .catch(err=>{
            console.log(err)
            this.setState({spinner:false})
        })

    }

    metamaskLogin(){
        //prompt user to login to metamask
        this.state.web3.metamaskLogin()
        .then(account=>{
            this.setState({userAccount:account})
        })
        .catch(err=>console.log(err))
    }

    createCard(uri,name,strength,cuteness,agility,lifespan,aggression){
        //create card
        if(this.state.contract){
            this.state.contract.createCard(uri,name,strength,cuteness,agility,lifespan,aggression)
            .then(()=>{
                document.getElementById("createCard_fileInput").value = ""
                this.setState({
                    image:null,
                    name:"",
                    strength:0,
                    cuteness:0,
                    agility:0,
                    lifespan:0,
                    aggression:0,
                })
            })
            .catch(err=>{
                console.log(err)
                alert("smart contract reverted createCard function")
            })
            .finally(()=>this.setState({spinner:false}))
        }else{
            console.log("contract not set")
            this.setState({spinner:false})
        }
    }


    render(){
        return(
            <div className="CreateCardContainer col-12">
                <Stack gap={2} className="col-6 mx-auto mt-5">
                    {
                        ((Config.forceNetwork && this.state.networkName !== Config.network) && <h6 className="text-center">Please switch to the {Config.network} network.</h6>) ||
                            
                        (<>
                            {this.state.networkName && <h6 className="text-center">{this.state.networkName}</h6>}
                            {(this.state.userAccount && <h6 className="text-center">{this.state.userAccount}</h6>) ||
                            <Button variant="success" className="mx-auto" onClick={this.metamaskLogin.bind(this)}>Login</Button>}
                            
                            
                            <input type="file" className="form-control form-control-lg" accept="image/jpg,image/jpeg,image/png" id="createCard_fileInput" onChange={this.onImageChange.bind(this)}/>
                            <input type="text" className="form-control mb-3" placeholder="name" value={this.state.name} onChange={this.onNameChange.bind(this)}/>

                            <p className="my-0">Strength - {this.state.strength}</p>
                            <input type="range" min="0" value={this.state.strength} max="1000" className="form-control" placeholder="strength" onChange={this.onStrengthChange.bind(this)}/>
                            <p className="my-0">Cuteness - {this.state.cuteness}</p>
                            <input type="range" min="0" value={this.state.cuteness} max="1000" className="form-control" placeholder="cuteness" onChange={this.onCutenessChange.bind(this)}/>
                            <p className="my-0">Agility - {this.state.agility}</p>
                            <input type="range" min="0" value={this.state.agility} max="1000" className="form-control" placeholder="agility" onChange={this.onAgilityChange.bind(this)}/>
                            <p className="my-0">Lifespan - {this.state.lifespan}</p>
                            <input type="range" min="0" value={this.state.lifespan} max="1000" className="form-control" placeholder="lifespan" onChange={this.onLifespanChange.bind(this)}/>
                            <p className="my-0">Aggression - {this.state.aggression}</p>
                            <input type="range" min="0" value={this.state.aggression} max="1000" className="form-control" placeholder="aggression" onChange={this.onAggressionChange.bind(this)}/>
                            

                            {(this.state.spinner && <Spinner animation="border" variant="primary" />) ||
                            <Button variant="primary" onClick={this.handleClick.bind(this)}>Create Card</Button>}
                        </>)
                        
                    }
                    
                    
                </Stack>
            </div>
        )
    }
}