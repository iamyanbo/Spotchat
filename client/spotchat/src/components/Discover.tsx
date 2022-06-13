import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";
import { NavbarComponent } from "./Navbar";

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
    accessToken: string;
    refreshToken: string;
}

class Discover extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
        }
    }

    getRelatedUsers = async () => {
        const response = await axios.get("http://localhost:8080/recommendations/" + this.state.user.userId);
        console.log(response.data);
        return response.data;
    }

    render() {
        if (localStorage.getItem("relatedUsers") === null) {
            axios.get("http://localhost:8080/recommendations/" + this.state.user.userId).then(res => {
                localStorage.setItem('relatedUsers', JSON.stringify(res.data));
            }).catch(err => {
                console.log(err);
            });
        }
        return (
            <div>
                <NavbarComponent />
                <h1>Discover</h1>
                <div>
                    {localStorage.getItem('relatedUsers') ? JSON.parse(localStorage.getItem('relatedUsers')!).map((user: User) => {
                        return <div key={user.userId}> 
                            <Button variant="primary" href={user.aboutMe.external_urls.spotify} target="_blank">
                                {user.aboutMe.display_name}
                            </Button>
                        </div>
                    }
                    ) : null}

                </div>
            </div>
        );
    }
}
export default Discover;