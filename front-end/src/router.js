import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import { HomePage } from './Components/homepage.js'
import { CreateCard } from './Components/CreateCard.js'

export default function Routes(){
      return(
    <BrowserRouter>
    <Switch> 
        <Route path='/' exact component={HomePage}></Route>
        <Route path='/createcard' exact component={CreateCard}></Route>
        <Route path='/' render={() => <div>404</div>}></Route>
    </Switch>
    </BrowserRouter>
    )
  }


