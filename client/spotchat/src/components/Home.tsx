import React from "react";
import reactDOM from "react-dom";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { NavbarComponent } from "./Navbar"
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
        console.log(this.state.user)
        if(localStorage.getItem("loggedIn") === "true"){
            return(
                <div>
                    <NavbarComponent />
                    <h1>SpotChat</h1>
                    <h6>Displayed Name: {this.state.user.aboutMe.display_name}</h6>
                    <h6>Email: {this.state.user.aboutMe.email}</h6>
                    <h6>Country: {this.state.user.aboutMe.country}</h6>
                    <ButtonToolbar>
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
        else{
            return <Navigate to="/login" />;
        }
    }
}
export default Home;