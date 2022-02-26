import { Request, Response, Router } from "express";
import { DI } from "../server";
var request = require('request');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
const router = Router();
router.use(cookieParser());
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = 'http://localhost:8080/callback';
const stateKey = 'spotify_auth_state';

var acc_tok: string;
var ref_tok: string;
router.get('/', (req: Request, res: Response) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, function(error: any, response: any, body: any) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        acc_tok = access_token;
        ref_tok = refresh_token;
        var options = {
          url: 'https://api.spotify.com/v1/me/playlists',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error: any, response: any, body: any) {
          console.log(body);
        });

        res.redirect('/home');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

export const CallbackController = router;
export { acc_tok, ref_tok };
