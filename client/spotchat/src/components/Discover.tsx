import axios from "axios";
import React from "react";
import { Accordion, Button } from "react-bootstrap";
import NavbarComponent  from "./Navbar";

interface User {
    userId: string
    aboutMe: any
    albums: any;
    playlists: any;
    topTracks: any;
    sex: string;
    InterestedIn: string;
    birthday: Date;
    bio: string;
    profilePicture: string;
    recommendedUsers: any;
    acceptedUsers: any;
    accessToken: string;
    refreshToken: string;
}

class Discover extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
            reload: true,
            relatedUsers: []
        }
        this.handleClickYes = this.handleClickYes.bind(this);
        this.handleClickNo = this.handleClickNo.bind(this);
    }

    async handleClickYes(event: any) {
        await axios.patch("http://localhost:8080/users/accepted", {
            userId: this.state.user.userId,
            acceptedUserId: event.target.id,
        }).then(res => {
            localStorage.setItem('relatedUsers', JSON.stringify(res.data));
        }).catch(err => {
            console.log(err);
        });
        this.setState({ reload: true });
    }

    async handleClickNo(event: any) {
        await axios.patch("http://localhost:8080/users/rejected", {
            userId: this.state.user.userId,
            rejectedUserId: event.target.id,
        }).then(res => {
            localStorage.setItem('relatedUsers', JSON.stringify(res.data));
        }).catch(err => {
            console.log(err);
        });
        this.setState({ reload: true });
    }

    componentDidMount() {
        localStorage.setItem("selected", "discover");
        axios.get("http://localhost:8080/recommendations/" + this.state.user.userId).then(res => {
            localStorage.setItem('relatedUsers', JSON.stringify(res.data));
            this.setState({ reload: false });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <NavbarComponent />
                <div>
                    {this.state.relatedUsers.length !== 0 ? JSON.parse(localStorage.getItem('relatedUsers')!).map((user: User) => {
                        return <div key={user.userId}> 
                        <Accordion>
                                <Accordion.Header>
                                    <h3>{user.aboutMe.display_name}</h3>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6>
                                        Bio: {user.bio}
                                    </h6>
                                    <Button variant="primary" href={user.aboutMe.external_urls.spotify} target="_blank">
                                        View on Spotify
                                    </Button>
                                    <Button variant="primary" onClick={this.handleClickYes} id={user.userId}> Yes </Button>
                                    <Button variant="primary" onClick={this.handleClickNo} id={user.userId}> No </Button>
                                </Accordion.Body>

                            </Accordion>
                            
                        </div>
                    }
                    ) : 
                    <div className="text-center">
                        <h1>No users found</h1>
                    </div>}
                </div>
            </div>
        );
    }
}
export default Discover;