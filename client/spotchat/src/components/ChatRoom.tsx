import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { NavbarComponent } from './Navbar';

class ChatRoom extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
            text:"",
            chats: [],
            channelId: window.location.pathname.split('/')[2],
            socket: io('ws://localhost:5000', {
                transports: ['websocket']})
        }
        this.state.socket.on(this.state.channelId, (data: any) => {
            this.setState({ chats: [...this.state.chats, data] });
        });
        this.handleTextChange = this.handleTextChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount() {
        const channel = await axios.get(`http://localhost:8080/channels/${this.state.channelId}`);
        this.setState({chats: channel.data.messages});
    }

    handleTextChange = (event: any) => {
        if (event.keyCode === 13) {
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
        } else {
            this.setState({text: event.target.value});
        }   
    }

    render() {
        return (
            <div className="ChatRoom">
            <NavbarComponent />
            <Button href="/chatList" variant="primary">
                Back to Chats
            </Button>
            <section>
                {this.state.chats.map((chat: any, index: number) => (
                    <div className="chat-message" key={index}>
                        <div className="chat-message-user">{chat.user.name}</div>
                        <div className="chat-message-text">{chat.message}</div>
                    </div>
                ))}
                <input
            type="text"
            value={this.state.text}
            placeholder="chat here..."
            className="form-control"
            onChange={this.handleTextChange}
            onKeyDown={this.handleTextChange}
          />
            </section>
          </div>
        );
    }
}

export default ChatRoom;