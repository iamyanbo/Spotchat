import { Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends React.Component<{},any>{
    constructor(props: any){
        super(props);
        this.state = {
            loggedIn: false,
            user: null,
            error: null,
        }
    }
    componentDidMount(){
        const userId = new URLSearchParams(window.location.search).get('userId');
        if (userId) {
            axios.get('http://localhost:8080/users/' + userId)
                .then(res => {
                    this.setState({user: res.data, loggedIn: true});
                })
                .catch(err => {
                    this.setState({error: err});
                });
        }
    }
    render(){
        if (this.state.error) {
            return <div>{this.state.error.message}</div>;
        } else if (this.state.loggedIn) {
            return <Navigate to="/home" />;
        } else {
            return (
                <div>
                    <h1>SpotChat</h1>
                    <>
                        <Button variant="primary" href={`http://localhost:8080/auth`}>
                            Login
                        </Button>
                    </>
                </div>
            );
        }
    }
}
export default Login;