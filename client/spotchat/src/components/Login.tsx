import { Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import SpotifyLogo from "./spotifyLogo.png";

class Login extends React.Component<{},any>{
    constructor(props: any){
        super(props);
        this.state = {
            loggedIn: false,
            error: null,
        }
    }
    componentDidMount(){
        const userId = new URLSearchParams(window.location.search).get('userId');
        if (userId) {
            axios.get('http://localhost:8080/users/' + userId)
                .then(res => {
                    this.setState({loggedIn: true});
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('user', JSON.stringify(res.data));
                })
                .catch(err => {
                    this.setState({error: err});
                });
        }
    }
    render(){
        if (this.state.error) {
            return <div>{this.state.error.message}</div>;
        } else if (this.state.loggedIn && localStorage.getItem('loggedIn') === 'true') {
            if (JSON.parse(localStorage.getItem('user')!).sex !== '') {
                window.location.href = "/home";
            } else {
                window.location.href = "/orientation";
            }
        } else {
            return (
                <div>
                    <h1 style={{ textAlign: 'center', marginTop: "20%"}}>SpotChat</h1>
                    <>
                        <Button variant="primary" href={`http://localhost:8080/auth`} style={{ margin: 'auto', display: 'block', width: '20%', height: '20%', fontSize: '100%', marginTop: "2%"}}>
                            <img src={SpotifyLogo} style={{ width: '30px', height: '30px', marginRight: '10px'}} />
                            Start Chatting using Spotify
                        </Button>
                    </>
                </div>
            );
        }
    }
}
export default Login;