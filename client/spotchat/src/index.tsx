import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, BrowserRouter as Router, Routes , Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import { Logout } from './components/Logout';
import Orientation from './components/Orientation';
import Discover from './components/Discover';
import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  
    <BrowserRouter>
    {localStorage.getItem("loggedIn") === "true" ? (
      localStorage.getItem("userDetails") === "true" ? (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/orientation" element={<Orientation />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="*" element={<Navigate to="/home"/>} />
      </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orientation" element={<Orientation />} />
          <Route path="*" element={<Navigate to="/orientation"/>} />
        </Routes>
      )
    ) : (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login"/>} />
      </Routes>
    )}
    </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
