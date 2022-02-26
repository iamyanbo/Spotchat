import { Request, Response, Router } from "express";
import { DI } from "../server";
var request = require('request');
var cookieParser = require('cookie-parser');
const router = Router();
router.use(cookieParser());
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

router.get('/', (req: Request, res: Response) => {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
      },
      json: true
  };
  request.post(authOptions, function(error: any, response: any, body: any) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
});

export const RefreshTokenController = router;