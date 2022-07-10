import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import NavbarComponent  from "./Navbar"

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')!);
        return(
            <div>
                <NavbarComponent />
                <section className="profile-section" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin:"10%"}}>
                    <h1>
                        Profile
                    </h1>
                    <Button variant="secondary" style={{margin: "10px"}} onClick={() => {
                        localStorage.setItem("changeProfile", "true");
                        localStorage.setItem("selected", "changeProfile");
                        window.location.href = "/changeProfile";
                    }}>
                        Change Profile
                    </Button>
                    <h6>Displayed Name: {user.aboutMe.display_name}</h6>
                    <h6>Email: {user.aboutMe.email}</h6>
                    <h6>Country: {user.aboutMe.country}</h6>
                    <h6>Bio: {user.bio}</h6>
                    <h6>Profile Picture: {<img src={user.profilePicture} alt="profile" style={{width: "100px", height: "100px", margin: "10px"}}/>}</h6>
                    <Button variant="primary" href="/logout">Logout</Button>
                </section>

            </div>
        );
}
export default Profile;