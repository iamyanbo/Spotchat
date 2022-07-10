import { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap"
import React from "react";

class NavbarComponent extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            selected: localStorage.getItem("selected") || "home",
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e: any) => {
        this.setState({selected: e.target.id});
        localStorage.setItem("selected", e.target.id);
    }

    render() {
        if (!window.location.href.includes(this.state.selected)) {
            window.location.reload();
        }
        return (
            <Navbar bg="dark" variant="dark" sticky="top">
                <Container>
                    <Navbar.Brand href="/home">SpotChat</Navbar.Brand>
                    <Nav>
                    <Nav.Link href="/home" id="home" onClick={this.handleClick} style={{backgroundColor: this.state.selected === "home" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Home</Nav.Link>
                    <Nav.Link href="/discover" id="discover" onClick={this.handleClick} style={{backgroundColor: this.state.selected === "discover" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Discover</Nav.Link>
                    <Nav.Link href="/chatList" id="chatList" onClick={this.handleClick} style={{backgroundColor: this.state.selected === "chatList" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Chat</Nav.Link>
                    <Nav.Link href="/profile" id="profile" onClick={this.handleClick} style={{backgroundColor: this.state.selected === "profile"? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Profile</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}
export default NavbarComponent;
