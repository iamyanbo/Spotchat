import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { NavbarComponent } from "./Navbar"

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')!);
        return(
            <div>
                <NavbarComponent />
                <h1>Profile</h1>
                <h6>Displayed Name: {user.aboutMe.display_name}</h6>
                <h6>Email: {user.aboutMe.email}</h6>
                <h6>Country: {user.aboutMe.country}</h6>
                <Button variant="primary" href="/logout">Logout</Button>
            </div>
        );
}
export default Profile;