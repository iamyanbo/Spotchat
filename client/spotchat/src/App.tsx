import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSearchParams } from 'react-router-dom';
import { ObjectID } from 'bson';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    aboutMe: Object,
    albums: Object,
    playlists: Object,
    topTracks: Object,
    accessToken: "",
    refreshToken: ""
  });
  const userId = new URLSearchParams(window.location.search).get('userId');
  useEffect(() => {
    console.log('asdf');
    if (userId) {
      setLoggedIn(true);
      axios.get('http://localhost:8080/users/' + userId)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);
  return (
    <div className="App">
      {loggedIn ? (
        <div>
          <h1>Home</h1>
        </div>
      ) : (
          <div>
            <h1>Login</h1>
            <Button variant="primary" href="http://localhost:8080/auth">Login</Button>
          </div>
        )}
    </div>
  );
}

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userId = new URLSearchParams(window.location.search).get('userId');
//     console.log('clicked');
//     if (userId) {
//       console.log('logged in');
//       axios.get('http://localhost:8080/users/' + userId)
//         .then(res => {
//           setUser(res.data);
//           setLoggedIn(true);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }
//   }, []);
//   return (
//     <div className="App">
//       {!loggedIn ? (
//         <div>
//           <h1>SpotChat</h1>
//           <>
//             <Button variant="primary" href={`http://localhost:8080/auth`}>
//               Login
//             </Button>
//           </>
//         </div>
//       ) : (
//         <div>
//           <h1>SpotChat</h1>
//           <h2>Welcome</h2>
//         </div>
//       )}
//     </div>
//   );
// }