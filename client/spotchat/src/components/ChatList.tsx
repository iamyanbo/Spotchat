import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";
import { NavbarComponent } from "./Navbar";

class ChatList extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("user")!),
            chats: [],
            channelsDisplay: [],
            channels: [],
            matchedUsers: []
        };
        this.handleClick = this.handleClick.bind(this);
    }
    
    async componentDidMount() {
        const userId = this.state.user.userId;
        const user = await axios.get(`http://localhost:8080/users/${userId}`);
        this.setState({ user: user.data });
        // make an array of channels from user.matchedUsers with user.userId and user.matchedUsers[i].userId in alphabetical order
        const channels = user.data.matchedUsers.map((objectId: string) => {
        if (user.data.id < objectId) {
            return `${user.data.id}-${objectId}`;
        } else {
            return `${objectId}-${user.data.id}`
        }

        }).sort();
        for (const channel of channels) {
            await axios.post("http://localhost:8080/channels", {
                channelId: channel,
                userId1: channel.split("-")[0],
                userId2: channel.split("-")[1]
            });
        }
        this.setState({ channels: channels });
        user.data.matchedUsers.forEach((objectId: string) => {
            axios.get(`http://localhost:8080/users/objectId/${objectId}`).then(res => {
                this.setState({ channelsDisplay: [...this.state.channelsDisplay, res.data.aboutMe.display_name] });
            })
        });
    }

    handleClick = (channelName: string) => {
        window.location.href = "/chat/" + channelName;
    }
    
    render() {
        return (
        <div>
            <NavbarComponent />
            {this.state.channelsDisplay!.map((channel: string) => {
                return (
                    <div key={channel}>
                        <Button variant="primary" onClick={() => this.handleClick(this.state.channels[this.state.channelsDisplay!.indexOf(channel)])}>
                            {channel}
                        </Button>
                    </div>
                );
            
            })}
        </div>
        );
    }
}
export default ChatList;