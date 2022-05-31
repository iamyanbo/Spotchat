import React from "react";
import reactDOM from "react-dom";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { NavbarComponent } from "./Navbar"
import Album from "./Album";
import TopTracks from "./TopTracks";

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
        console.log(this.state.user)
        return(
            <div className="row">
                <NavbarComponent />
                <h1>Home</h1>
                <ButtonToolbar style={{alignItems:"center", justifyContent:"center"}}>
                    <ButtonGroup>
                        <Button variant="primary" onClick={this.handleClick1}>Playlists</Button>
                        <Button variant="primary" onClick={this.handleClick2}>Top Tracks</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {this.state.displayAlbums?<Album />:null}
                {this.state.displayTopTracks?<TopTracks />:null}
            </div>
        );
    }
}

export default Home;