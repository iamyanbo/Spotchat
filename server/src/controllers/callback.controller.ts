import { Request, Response, Router } from "express";
import { MongoClient } from "mongodb";
import { DI } from "../server";
import qs from 'qs';
async function createUser(user: any): Promise<any> {
  const uri = "mongodb+srv://testuser:randompassword123@cluster0.9b1cx.mongodb.net/spotify?retryWrites=true&w=majority";
  const client = new MongoClient(uri); 
  console.log("Connecting to MongoDB");
  try{
    await client.connect();
    console.log("Connected to MongoDB");
    const result = await client.db("spotify").collection("users").insertOne(user);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}
var axios = require('axios');
var cookieParser = require('cookie-parser');
const router = Router();
router.use(cookieParser());
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = 'http://localhost:8080/callback';
var buffer = Buffer.from(client_id + ':' + client_secret).toString('base64');
var accTok: string;
var refTok: string;
var user: any;
const getToken = (code: any) => {
  return axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: 'client_credentials',
      redirect_uri: redirect_uri,
    },
    headers: {
      'Authorization': 'Basic ' + buffer,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  })
  .then((response: any) => {
    return response.data.access_token;
  })
  .catch(function (error: any) {
    console.log(error);
  });
}
const getData = (token: any) => {
  const spotifyEndpoints = ['https://api.spotify.com/v1/me', 'https://api.spotify.com/v1/me/playlists', 'https://api.spotify.com/v1/me/albums', 'https://api.spotify.com/v1/me/top/tracks', 'https://api.spotify.com/v1/me/following?type=artist'];
  const promises = spotifyEndpoints.map(endpoint => {
    return axios({
      method: 'get',
      url: endpoint,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    })
    .then((response: any) => {
      return response.data;
    })
    .catch(function (error: any) {
      console.log(error);
    });
  });
  return Promise.all(promises);
}

router.get('/', (req: Request, res: Response) => {
  var code = req.query.code || null;
  if(code === null) {
    res.redirect('/#' +
      qs.stringify({
        error: 'invalid_token'
      }));
  } else {
    getToken(code).then((response: any) => {
      accTok = response;
      res.redirect('/home');
    });
  }
});

export const CallbackController = router;
export { accTok };
