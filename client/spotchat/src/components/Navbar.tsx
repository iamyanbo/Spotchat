import { Navbar, Container, Nav } from "react-bootstrap"

export const NavbarComponent = () => {
    return (
        <Navbar sticky="top" bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand href="/">SpotChat</Navbar.Brand>
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/logout">Logout</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
            </Container>
        </Navbar>
    );
};
