import { Request, Response, Router } from "express";
import { DI } from "../server";
import qs from 'qs';
import { User, Song, Artist, Album } from "../entities";
import axios from "axios";
const router = Router();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8080/callback';
const buffer = Buffer.from(client_id + ':' + client_secret).toString('base64');
const stateKey = 'spotify_auth_state';

export const saveUser = async (user: any) => {
  const newUser = new User(user.about.id,
    user.about,
    user.playlists, 
    user.albums, 
    user.topTracks);
  //find if the user is already in the database
  DI.em.findOne(User, { userId: user.about.id }).then((user: any) => {
    if (user === null) {
      DI.em.persist(newUser).flush();
      return newUser;
    } else {
      //if they are, update the user
      user.about = newUser.aboutMe;
      user.playlists = newUser.playlists;
      user.albums = newUser.albums;
      user.topTracks = newUser.topTracks;
      DI.em.persist(user).flush();
      return user;
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
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token
    };
  } catch (error) {
    console.log(error);
  }
}

const getData = async (token: string) => {
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
  .then(axios.spread((about: any, playlists: any, albums: any, topTracks: any) => {
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

//save song by using the song id to database
export const saveSongById = async (songId: string, token: string, album?: Album) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/tracks/' + songId, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const Id = response.data.id;
    const song = await DI.em.findOne(Song, { songId: Id });
    if (song === null) {
      const newSong = new Song(response.data.name, Id);
      if (typeof album !== 'undefined') {
        newSong.album = album;
      }
      await DI.em.persist(newSong).flush();
      //add the song to the artists
      response.data.artists.forEach(async (artist: any) => {
        await saveArtistById(artist.id, token, newSong);
      });
      return newSong;
    } else {
      if (typeof album !== 'undefined') {
        song.album = album;
        await DI.em.persist(song).flush();
        return song;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//save artist by using the artist id to database and return the artist
export const saveArtistById = async (artistId: string, token: string, song?: Song) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/artists/' + artistId, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const artist = await DI.em.findOne(Artist, { artistId: artistId });
    if (artist === null) {
      const newArtist = new Artist(response.data.name, artistId);
      if (typeof song !== 'undefined') {
        newArtist.songs.add(song);
      }
        await DI.em.persist(newArtist).flush();
      return newArtist;
    } else {
      if (typeof song !== 'undefined') {
        artist.songs.add(song);
        await DI.em.persist(artist).flush();
      }
      return artist;
    }
  } catch (error) {
    console.log(error);
  }
}

//save album by using the album id to database and return the album
export const saveAlbumById = async (albumId: any, token: string) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/albums/' + albumId, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const album = await DI.em.findOne(Album, { albumId: albumId });
    if (album === null) {
      const newAlbum = new Album(response.data.name, albumId);
      response.data.artists.forEach(async (artist: any) => {
        const newArtist: any = await saveArtistById(artist.id, token);
        newArtist.albums.add(newAlbum);
        await DI.em.persist(newArtist).flush();
      });
      for (let i = 0; i < response.data.tracks.items.length; i++) {
        await saveSongById(response.data.tracks.items[i].id, token, newAlbum);
      }
      await DI.em.persist(newAlbum).flush();
      return newAlbum;
    }
  } catch (error) {
    console.log(error);
  }
}

//save artist to database
export const saveArtist = async (artistName: string, token: string, song?: Song) => {
  const artist = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const artistId = artist.data.artists.items[0].id;
  const artistDatabase = await DI.em.findOne(Artist, { artistId: artistId });
  if (artistDatabase === null) {
    const newArtist = new Artist(artist.data.artists.items[0].name, artistId);
    if (typeof song !== 'undefined') {
      newArtist.songs.add(song);
    }
      await DI.em.persist(newArtist).flush();
    return newArtist;
  } else {
    if (typeof song !== 'undefined') {
      artistDatabase.songs.add(song);
      await DI.em.persist(artistDatabase).flush();
    }
    return artistDatabase;
  }
}

//save song to database and return the song
//use this one for when a user searches for a song by name
export const saveSong = async (songName: string, token: string, album?: Album) => {
  const response = await axios.get(`https://api.spotify.com/v1/search?q=${songName}&type=track`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const songId = response.data.tracks.items[0].id;
  const songDatabase = await DI.em.findOne(Song, { songId: songId });
  if (songDatabase === null) {
    const newSong = new Song(response.data.tracks.items[0].name, songId);
    if (typeof album !== 'undefined') {
      newSong.album = album;
      response.data.tracks.artists.forEach(async (artist: any) => {
        await saveArtistById(artist.id, token, newSong);
    });
      await DI.em.persist(newSong).flush();
    return newSong;
    } else {
      if (typeof response.data.tracks.items[0].album !== 'undefined') {
        await saveAlbumById(response.data.tracks.items[0].album.id, token);
      }
      await DI.em.persist(newSong).flush();
      return newSong;
    }
  } else {
    if (typeof album !== 'undefined') {
      songDatabase.album = album;
      await DI.em.persist(songDatabase).flush();
    }
    return songDatabase;
  }
}

//save album in database
export const saveAlbum = async (albumname: any, token: string) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${albumname}&type=album&limit=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.albums.items.length > 0) {
      const albumId = response.data.albums.items[0].id;
      const albumDatabase = await DI.em.findOne(Album, { albumId: albumId });
      if (albumDatabase === null) {
        //get the album from api with 1000 limit
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'limit': 1000
          }
        });
        const newAlbum = new Album(albumResponse.data.name, albumId);
        albumResponse.data.artists.forEach(async (artist: any) => {
          const newArtist: any = await saveArtistById(artist.id, token);
          newArtist.albums.add(newAlbum);
          await DI.em.persist(newArtist).flush();
        });
        //add the songs to the album
        for (let i = 0; i < albumResponse.data.tracks.items.length; i++) {
          await saveSongById(albumResponse.data.tracks.items[i].id, token, newAlbum);
        }
        await DI.em.persist(newAlbum).flush();
        return newAlbum;
      }
    }
  } catch (error) {
    console.log(error);
  }
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
    getToken(code).then(async (response: any) => {
      res.cookie("accessToken", response.accessToken);
      getData(req.cookies.accessToken).then((response: any) => {
        saveUser(response);
      });  
      res.redirect('/home');
    });
  }
});

export const CallbackController = router;