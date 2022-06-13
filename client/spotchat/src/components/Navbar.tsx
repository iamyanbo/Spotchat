import { Navbar, Container, Nav } from "react-bootstrap"

export const NavbarComponent = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/home">SpotChat</Navbar.Brand>
                <Nav>
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="discover">Discover</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};
