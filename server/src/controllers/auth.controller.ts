import { Request, Response, Router } from "express";
const router = Router();

var client_id = process.env.CLIENT_ID;
var redirect_uri = 'http://localhost:8080/callback';
const scopes = [
  'user-read-private user-read-playback-state user-read-currently-playing user-read-private user-read-email user-follow-read user-library-read user-top-read user-read-recently-played playlist-read-collaborative playlist-read-private'
];
const stateKey = 'spotify_auth_state';
var generateRandomString = function(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


router.get("/", (req: Request, res: Response) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  //authorize user
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scopes.join('%20')}&redirect_uri=${redirect_uri}&state=${state}`);
});

export const AuthController = router;
