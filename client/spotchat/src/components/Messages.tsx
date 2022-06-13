import React from "react";
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';

class Messages extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            chats: [],
            user: JSON.parse(localStorage.getItem('user')!),
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        const username = this.state.user.aboutMe.display_name;
        const pusher = new Pusher("1646309d247a7d0867da", {
            cluster: "us2"
        });
        const channel = pusher.subscribe("chat");
        channel.bind('message', (data: any) => {
            this.setState({
                chats: [...this.state.chats, data], test: '' 
            });
        });
        console.log(this.state.chats);
        this.handleTextChange = this.handleTextChange.bind(this);
      }

      handleTextChange(event: any) {
        if (event.keyCode === 13) {
          const payload = {
            username: this.state.user.aboutMe.display_name,
            message: this.state.text
          };
          axios.post('http://localhost:8080/messages', payload).then(res => {
            });
        } else {
          this.setState({ text: event.target.value });
        }
      }

    render() {
        return (
            <div>
                <ChatList chats={this.state.chats} />
                <ChatBox text={this.state.text} handleTextChange={this.handleTextChange} username={this.state.user.aboutMe.display_name} />
            </div>
        );
    }
}
export default Messages;