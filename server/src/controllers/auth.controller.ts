import { Request, Response, Router } from "express";
import { DI } from "../server";
var request = require('request');
var cookieParser = require('cookie-parser');
const router = Router();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
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


// TODO: create actual register endpoint

// router.post("/register", async (req: Request, res: Response) => {
//   if (!req.body.username || !req.body.email || !req.body.password) {
//     res.status(400);
//     return res.json({ message: "One of `name, email, password` is missing" });
//   }

//   try {
//     const user = DI.userRepository.create(req.body);
//     await DI.userRepository.persist(user).flush();

//     res.json(user);
//   } catch (e: any) {
//     return res.status(400).json({ message: e.message });
//   }
// });

export const AuthController = router;
