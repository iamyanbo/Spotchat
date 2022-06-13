import React from "react";
import "./ChatList.css";
export default ({ chats }: { chats: any}) => (
  <ul>
    {chats.map((chat: any) => {
      return (
        <div>
          <div className="row show-grid">
            <div className="col-xs-12">

              <div className="chatMessage">
                <div key={chat.id} className="box">
                  <p>
                    <strong>{chat.username}</strong>
                  </p>
                  <p>{chat.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </ul>
);