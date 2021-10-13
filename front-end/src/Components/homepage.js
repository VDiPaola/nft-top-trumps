import React from "react";
import { Link } from "react-router-dom";


export class HomePage extends React.Component{
    render(){
        return(
            <div>
                <Link to='/createcard'>CreateCard</Link>
            </div>
        )
    }
}
