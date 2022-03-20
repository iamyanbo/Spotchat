import { Request, Response, Router } from "express";
import { DI } from "../server";
import qs from 'qs';
import { User } from "../entities";
import axios from "axios";
const router = Router();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8080/callback';
const buffer = Buffer.from(client_id + ':' + client_secret).toString('base64');
const stateKey = 'spotify_auth_state';
let accessToken: string;
let refreshToken: string;

function makeUser(user: any): any {
  const newUser = new User(user.about.id,
    user.about,
    user.playlists, 
    user.albums, 
    user.topTracks);
  //find if the user is already in the database
  DI.em.findOne(User, { userId: user.about.id }).then((user: any) => {
    if (user === null) {
      DI.em.persist(newUser).flush();
    } else {
      //delete the old user
      DI.em.remove(user).flush();
      //create a new user
      DI.em.persist(newUser).flush();
    }}).catch((error: any) => {
      console.log(error);
    });
}

const getToken = async (code: any) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    }), {
      headers: {
        'Authorization': 'Basic ' + buffer,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token
    };
  } catch (error) {
    console.log(error);
  }
}

const getData = (token: any) => {
  const spotifyEndpoints = ['https://api.spotify.com/v1/me',
   'https://api.spotify.com/v1/me/playlists', 
   'https://api.spotify.com/v1/me/albums', 
   'https://api.spotify.com/v1/me/top/tracks'
  ];
  return axios.all([
    axios.get(spotifyEndpoints[0], {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }),
    axios.get(spotifyEndpoints[1], {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }),
    axios.get(spotifyEndpoints[2], {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }),
    axios.get(spotifyEndpoints[3], {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  ])
  .then(axios.spread((about: any, playlists: any, albums: any, topTracks: any, artists: any) => {
    return {
      about: about.data,
      playlists: playlists.data,
      albums: albums.data,
      topTracks: topTracks.data,
    }
  }))
  .catch(function (error: any) {
    console.log(error);
  });
}

router.get('/', (req: Request, res: Response) => {
  const code = req.query.code || null;
  if(code === null) {
    res.redirect('/#' +
      qs.stringify({
        error: 'invalid_token'
      }));
  } else {
    res.clearCookie(stateKey);
    getToken(code).then((response: any) => {
      accessToken = response.access_token;
      refreshToken = response.refresh_token;
      getData(accessToken).then((response: any) => {
        makeUser(response);
      });  
      res.redirect('/home');
    });
  }
});

export const CallbackController = router;
export { accessToken , refreshToken };
