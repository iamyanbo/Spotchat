import axios from "axios";
import React from "react";
import { Accordion, AccordionButton, Button } from "react-bootstrap";
import NavbarComponent  from "./Navbar";

class ChatList extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("user")!),
            chats: [],
            channelsDisplay: [],
            channels: [],
            isCancelled: {}
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
            axios.get(`http://localhost:8080/users/objectId/${objectId}`).then(res1 => {
                console.log(res1.data);
                this.setState({ channelsDisplay: [...this.state.channelsDisplay, [res1.data.aboutMe.display_name, res1.data.bio, res1.data.profilePicture] ] });
                axios.post("http://localhost:8080/matches/isCancelled/objectId", {
                userId: this.state.user.id,
                otherUserId: objectId
                }).then(res2 => {
                    this.setState({ isCancelled: { ...this.state.isCancelled, [res1.data.aboutMe.display_name]: res2.data } });
                });
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
                        <Accordion>
                            <Accordion.Header>
                                <h3>{channel[0]}</h3>
                                <img src={channel[2]} alt="profile picture" style={{width: "100px", height: "100px"}} />
                                <a onClick={() => this.handleClick(this.state.channels[this.state.channelsDisplay.indexOf(channel)])}
                                    style={{right: "10%", position: "fixed", width:"10%", backgroundColor: "#0275d8", height: "5%", textAlign: "center", margin:"auto", padding:"12px", borderRadius:"5px"}}>Chat</a>
                            </Accordion.Header>
                            <Accordion.Body >
                                <p style={{wordBreak: "break-word"}}>
                                    Bio: {channel[1]}
                                </p>
                                {this.state.isCancelled[channel[0]] ? 
                                <p style={{color: "red"}}>
                                    Unmatched
                                </p>
                                :
                                null}
                            </Accordion.Body>
                        </Accordion>
                    </div>
                );
            })}
        </div>
        );
    }
}
export default ChatList;