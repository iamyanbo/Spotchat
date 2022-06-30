import axios from 'axios';
import React from 'react';
import { Button, Card, Offcanvas } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { io } from 'socket.io-client';
import { NavbarComponent } from './Navbar';

class ChatRoom extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
            userId: JSON.parse(localStorage.getItem('user')!).userId,
            text:"",
            chats: [],
            channelId: window.location.pathname.split('/')[2],
            socket: io('ws://localhost:5000', {
                transports: ['websocket']}),
            styleSelf: {
                backgroundColor: '#3a5ebf',
                borderRadius: '5px',
                color: 'white',
                padding: '5px',
                margin: '5px',
                width: 'fit-content',
                clear: 'both',
                float: 'right',
                marginRight: '20%',
                maxWidth: '30%'
            },
            styleOther: {
                backgroundColor: '#f5f5f5',
                borderRadius: '5px',
                color: 'black',
                padding: '5px',
                margin: '5px',
                width: 'fit-content',
                clear: 'both',
                float: 'left',
                marginLeft: '20%',
                maxWidth: '30%'
            },
            userOther: {
                displayName: '',
                spotifyUrl: '',
                profilePicture: '',
                birthday: '',
                bio: '',
            },
            userSelf: {
                displayName: '',
                spotifyUrl: '',
                profilePicture: '',
                birthday: '',
                bio: '',
            },
            show: false,
            selectedUser: {
                displayName: '',
                spotifyUrl: '',
                profilePicture: '',
                birthday: '',
                bio: '',
            },
            scroll: true
        }
        this.state.socket.on(this.state.channelId, (data: any) => {
            this.setState({ chats: [...this.state.chats, data] });
        });
        this.handleTextChange = this.handleTextChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.scroll = this.scroll.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    async componentDidMount() {
        const channel = await axios.get(`http://localhost:8080/channels/${this.state.channelId}`);
        this.setState({chats: channel.data.messages});
        const user1 = await axios.get(`http://localhost:8080/users/objectId/${channel.data.users[0]}`);
        const user2 = await axios.get(`http://localhost:8080/users/objectId/${channel.data.users[1]}`);
        if (user1.data.userId === this.state.userId) {
            this.setState({ userOther: {
                displayName: user2.data.aboutMe.display_name,
                spotifyUrl: user2.data.aboutMe.external_urls.spotify,
                profilePicture: user2.data.profilePicture,
                birthday: user2.data.birthday,
                bio: user2.data.bio
            }});
            this.setState({ userSelf: {
                displayName: user1.data.aboutMe.display_name,
                spotifyUrl: user1.data.aboutMe.external_urls.spotify,
                profilePicture: user1.data.profilePicture,
                birthday: user1.data.birthday,
                bio: user1.data.bio
            }});
        } else {
            this.setState({ userOther: {
                displayName: user1.data.aboutMe.display_name,
                spotifyUrl: user1.data.aboutMe.external_urls.spotify,
                profilePicture: user1.data.profilePicture,
                birthday: user1.data.birthday,
                bio: user1.data.bio
            }});
            this.setState({ userSelf: {
                displayName: user2.data.aboutMe.display_name,
                spotifyUrl: user2.data.aboutMe.external_urls.spotify,
                profilePicture: user2.data.profilePicture,
                birthday: user2.data.birthday,
                bio: user2.data.bio
            }});
        }
    }

    scroll = () => {
        window.scroll(0, document.body.scrollHeight);
    }

    componentDidUpdate() {
        if (this.state.scroll) {
            this.scroll();
        }
    }

    handleTextChange = (event: any) => {
        if (event.keyCode === 13 && this.state.text !== "") {
            const message = {
                user: {
                    userId: this.state.user.userId,
                    name: this.state.user.aboutMe.display_name,
                    avatar: this.state.user.profilePicture
                },
                message: event.target.value,
                timestamp: new Date().getTime()
            }
            this.setState({text: ""});
            axios.patch("http://localhost:8080/channels", {
                message: message,
                channelId: this.state.channelId
            });
            this.setState({scroll: true});
        } else {
            this.setState({text: event.target.value});
        }   
    }

    handleSubmit = () => {
        if (this.state.text !== "") {
            const message = {
                user: {
                    userId: this.state.user.userId,
                    name: this.state.user.aboutMe.display_name,
                    avatar: this.state.user.profilePicture
                },
                message: this.state.text,
                timestamp: new Date().getTime()
            }
            this.setState({text: ""});
            axios.patch("http://localhost:8080/channels", {
                message: message,
                channelId: this.state.channelId
            });
        }
        this.setState({scroll: true});
    }

    handleShow(userself: boolean) {
        if (userself) {
            this.setState({ selectedUser: this.state.userSelf });
        } else {
            this.setState({ selectedUser: this.state.userOther });
        }
        this.setState({ show: true });
        this.setState({ scroll: false });
    }

    handleClose = () => {
        this.setState({show: false});

    }

    render() {
        return (
            <div className="ChatRoom">
                <NavbarComponent />
                <Button href="/chatList" variant="outline-secondary" style={{margin: "10px", position: "fixed"}}>Back to Chat List</Button>
                <section style={{display: "inline-block", width: "100%", marginTop:"5%", marginBottom:"5%"}}>
                    <Offcanvas show={this.state.show} onHide={this.handleClose}>
                        <Offcanvas.Title style={{textAlign: "center", margin: "10px"}}>
                            {this.state.selectedUser.displayName}
                        </Offcanvas.Title>
                        <Offcanvas.Body>
                            <img src={this.state.selectedUser.profilePicture} style={{width: "100px", height: "100px", margin: "10px"}} />
                            {this.state.selectedUser.birthday}
                            {this.state.selectedUser.bio}

                        </Offcanvas.Body>
                    </Offcanvas>
                    {this.state.chats.map((chat: any, index: number) => (
                        <div className="chat-message" key={index}>
                            <Card style={chat.user.userId === this.state.userId ? this.state.styleSelf : this.state.styleOther}>
                                <Card.Header>
                                    <div style={{cursor: "pointer"}}>
                                        <a onClick={() => this.handleShow(chat.user.userId === this.state.userId)}>
                                            <img src={chat.user.avatar} alt="avatar" style={{width: "30px", height: "30px", borderRadius: "50%"}} />
                                            <span style={{margin: "0px 10px"}}>{chat.user.name}</span>
                                        </a>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {chat.message}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                    <div style={{textAlign: "center", position: "fixed", bottom: "0px", width: "100%", backgroundColor: "#f5f5f5", display:"flex"}}>
                        <input
                            style={{margin: "10px", borderRadius: "5px", padding: "5px", width:"100%", marginLeft:"20%"}}
                            type="text"
                            value={this.state.text}
                            placeholder="chat here..."
                            className="form-control"
                            onChange={this.handleTextChange}
                            onKeyDown={this.handleTextChange}
                        />
                        <Button variant="outline-primary" style={{margin: "10px", borderRadius: "5px", padding: "5px", marginRight:"20%"}} onClick={this.handleSubmit}>Send</Button>
                    </div>
            </section>
          </div>
        );
    }
}

export default ChatRoom;