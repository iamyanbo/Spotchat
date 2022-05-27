import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import { Routes, Route } from 'react-router-dom';

const Main = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default Main;