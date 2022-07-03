import axios from "axios";
import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import NavbarComponent  from "./Navbar";

class ChangeProfile extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
            profilePicture: null,
            bio : "",
        }
        this.handleProfilePictureChange = this.handleProfilePictureChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("changeProfile") !== "true") {
            window.location.href = "/";
        }
        this.setState({bio: this.state.user.bio});
        this.setState({profilePicture: this.state.user.profilePicture});
    }

    handleProfilePictureChange(event: any) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            this.setState({profilePicture: reader.result});
        }
        reader.readAsDataURL(file);
    }

    handleInputChange(event: any) {
        this.setState({bio: event.target.value});
    }

    handleSubmit(event: any) {
        axios.patch("http://localhost:8080/users", {
            userId: this.state.user.userId,
            sex: this.state.user.sex,
            interestedIn: this.state.user.InterestedIn,
            birthday: this.state.birthday,
            bio: this.state.bio,
            profilePicture: this.state.profilePicture
        }
        ).then(res => {
            localStorage.setItem("changeProfile", "false");
            axios.get("http://localhost:8080/users/" + this.state.user.userId).then(res => {
                localStorage.setItem("user", JSON.stringify(res.data));
                localStorage.setItem("selected", "home");
                window.location.href = "/home";
            });
        });
    }
    render() {
        return (
            <div>
                <NavbarComponent />
                <section className="profile-section" style={{margin:"10px"}}>
                    <h6>
                        Bio:
                    </h6>
                    <InputGroup>
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="Max 200 characters" maxLength={200} value={this.state.bio} onChange={this.handleInputChange} />
                    </InputGroup>
                    <h6>Profile picture:</h6>
                    <img src={this.state.profilePicture} style={{width: "200px", height: "200px"}} />
                    <input id="input-file-1" name="input-file-1[]" multiple type="file" accept="image/*" onChange={this.handleProfilePictureChange} />
                    <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                </section>
            </div>
        );
    }
}

export default ChangeProfile