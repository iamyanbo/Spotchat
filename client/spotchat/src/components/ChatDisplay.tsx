import React from "react";

function ChatDisplay(props: any) {
    return (
        <div className="chat-display">
        {props.chats.map((chat: any) => (
            <div className="chat-message">
            <div className="chat-message-user">{chat.user.aboutMe.display_name}</div>
            <div className="chat-message-text">{chat.message}</div>
            </div>
        ))}
        </div>
    );
}

export default ChatDisplay;