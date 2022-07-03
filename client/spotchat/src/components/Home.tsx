import React from "react";
import reactDOM from "react-dom";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import NavbarComponent from "./Navbar"
import Album from "./Album";
import TopTracks from "./TopTracks";
import { Navigate } from "react-router-dom";

class Home extends React.Component<{}, any>{
    constructor(props: any){
        super(props);
        this.state = {
            user : JSON.parse(localStorage.getItem('user')!),
            displayAlbums: false,
            displayTopTracks: true,
        }
    }

    handleClick1 = (e: any) => {
        this.setState({displayAlbums: true, displayTopTracks: false});
    }
    handleClick2 = (e: any) => {
        this.setState({displayAlbums: false, displayTopTracks: true});
    }
    
    render(){
        return(
            <div>
                <NavbarComponent />
                <ButtonToolbar style={{display: "flex", justifyContent: "center", marginTop:"1%"}}>
                    <ButtonGroup>
                        <Button variant="primary" onClick={this.handleClick1}>Albums</Button>
                        <Button variant="primary" onClick={this.handleClick2}>Top Tracks</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {this.state.displayAlbums ? <Album /> : null}
                {this.state.displayTopTracks ? <TopTracks /> : null}
            </div>
        );
    
    }
}
export default Home;