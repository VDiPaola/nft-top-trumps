import React from "react";
import Web3 from "../web3";
import Config from '../Config.json'
import { Container, Stack, Card, ListGroup, ListGroupItem, Button, Row, Spinner } from "react-bootstrap";
import { ethers } from "ethers";

export class HomePage extends React.Component{
    constructor(props){
        super(props)
        const web3 = new Web3()
        const {provider,signer} = web3.initWeb3()
        this.state = {
            web3,
            provider,
            signer,
            contract:null,
            userAccount:null,
            networkName:null,

            allCards:[],
            userCards:[],

            spinner:false,
            signed:null
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
            this.setState({contract}, ()=>{
                //get cards
                this.getCards()
                //get user cards
                this.getUserCards()
            })
        })
        .catch(err=>console.log(err))
    }

    metamaskLogin(){
        //prompt user to login to metamask
        this.state.web3.metamaskLogin()
        .then(account=>{
            this.setState({userAccount:account})
        })
        .catch(err=>console.log(err))
    }

    getCards(){
        if(this.state.contract){
            this.state.contract.getCards()
            .then(allCards=>{
                this.setState({allCards})
            })
            .catch(err=>console.log(err))
        }
    }

    getUserCards(){
        if(this.state.contract){
            this.state.contract.getTokens()
            .then(userCards=>{
                this.setState({userCards})
            })
            .catch(err=>console.log(err))
        }
    }


    formatAllCards(){
        if(this.state.allCards.length > 0){
            return this.state.allCards.map(card=>(
                <Card className="w-100" key={card.uri}>
                    <Card.Body>
                        <Card.Title className="text-center">{card.name}</Card.Title>
                    </Card.Body>
                    <Card.Img variant="top" src={"https://ipfs.io/ipfs/"+card.uri.split("").splice(6).join("")} />
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Strength: {card.strength}</ListGroupItem>
                        <ListGroupItem>Cuteness: {card.cuteness}</ListGroupItem>
                        <ListGroupItem>Agility: {card.agility}</ListGroupItem>
                        <ListGroupItem>Lifespan: {card.lifespan}</ListGroupItem>
                        <ListGroupItem>Aggression: {card.aggression}</ListGroupItem>
                    </ListGroup>
                </Card>
            ))
        }
    }

    formatUserCards(){
        if(this.state.userCards.length > 0){
            return this.state.userCards.map(card=>(
                <Card className="w-100" key={card.uri}>
                    <Card.Body>
                        <Card.Title className="text-center">{card.name}</Card.Title>
                        <Card.Text>Rarity: {card.rarity}</Card.Text>
                    </Card.Body>
                    <Card.Img variant="top" src={"https://ipfs.io/ipfs/"+card.uri.split("").splice(6).join("")} />
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Strength: {card.strength}</ListGroupItem>
                        <ListGroupItem>Cuteness: {card.cuteness}</ListGroupItem>
                        <ListGroupItem>Agility: {card.agility}</ListGroupItem>
                        <ListGroupItem>Lifespan: {card.lifespan}</ListGroupItem>
                        <ListGroupItem>Aggression: {card.aggression}</ListGroupItem>
                    </ListGroup>
                </Card>
            ))
        }
    }

    buyPack(){
        if(this.state.contract){
            this.setState({spinner:true})
            this.state.contract.buyPack({value:ethers.utils.parseEther("0.1")})
            .then(()=>{
                this.getUserCards()
            })
            .catch(err=>console.log(err))
            .finally(()=>this.setState({spinner:false}))
        }
    }



    render(){
        return(
            <Container className="vh-100">
                <Row className="h-100">
                    <Stack gap={1} className="col-3 float-left my-auto">
                        {
                            (this.state.spinner && <Spinner className="mx-auto" animation="border"/>) ||
                            <Button variant="success" className="mt-2" onClick={this.buyPack.bind(this)}>Buy Pack</Button>
                        }
                        
                        <p className="text-center">
                        Buying a pack will mint you 5 cards from the list on the right with a chance of getting higher rarities.
                        Higher rarities increase stats slightly.
                        </p>
                    </Stack>
                    <Stack gap={1} className="col-4 overflow-auto h-100 float-right">
                        <h3 className="font-weight-bold text-center">Your Cards</h3>
                        {this.formatUserCards()}
                    </Stack>
                    <Stack gap={1} className="col-4 overflow-auto h-100 float-right">
                        <h3 className="font-weight-bold text-center">All Cards</h3>
                        {this.formatAllCards()}
                    </Stack>
                </Row>
            </Container>
        )
    }
}
