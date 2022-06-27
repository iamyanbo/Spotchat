import { useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap"

export const NavbarComponent = () => {
    const selected = typeof(localStorage.getItem("selected")) === "string" ? localStorage.getItem("selected") : localStorage.setItem("selected", "home");
    const handleClick = (e: any) => {
        localStorage.setItem("selected", e.target.id);
    }
    
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/home">SpotChat</Navbar.Brand>
                <Nav>
                <Nav.Link href="/home" id="home" onClick={handleClick} style={{backgroundColor: localStorage.getItem("selected") === "home" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Home</Nav.Link>
                <Nav.Link href="/discover" id="discover" onClick={handleClick} style={{backgroundColor: localStorage.getItem("selected") === "discover" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Discover</Nav.Link>
                <Nav.Link href="/chatList" id="chatList" onClick={handleClick} style={{backgroundColor: localStorage.getItem("selected") === "chatList" ? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Chat</Nav.Link>
                <Nav.Link href="/profile" id="profile" onClick={handleClick} style={{backgroundColor: localStorage.getItem("selected") === "profile"? "#3a5ebf" : "transparent", borderRadius: "5px"}}>Profile</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

