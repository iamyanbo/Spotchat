import { Request, Response, Router } from "express";
import { DI } from "../server";
import qs from 'qs';
import { Post, User, Song, Artist, Album, Comment } from "../entities";
import axios from "axios";
import { ObjectId } from "@mikro-orm/mongodb";
import { wrap } from '@mikro-orm/core';
const router = Router();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8080/callback';
const buffer = Buffer.from(client_id + ':' + client_secret).toString('base64');
const stateKey = 'spotify_auth_state';
let accessToken: string;
let refreshToken: string;

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
    } else {
      //if they are, update the user
      user.about = newUser.aboutMe;
      user.playlists = newUser.playlists;
      user.albums = newUser.albums;
      user.topTracks = newUser.topTracks;
      DI.em.persist(user).flush();
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

const getData = (token: string) => {
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
    } else {
      if (typeof album !== 'undefined') {
        song.album = album;
        await DI.em.persist(song).flush();
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
        await DI.em.persist(newArtist).flush();
      } else {
        await DI.em.persist(newArtist).flush();
      }
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
      await DI.em.persist(newArtist).flush();
    } else {
      await DI.em.persist(newArtist).flush();
    }
    return newArtist;
  } else {
    if (typeof song !== 'undefined') {
      artistDatabase.songs.add(song);
      await DI.em.persist(artistDatabase).flush();
    }
    return artistDatabase;
  }
}

//save song to database
//use this one for when a user searches for a song by name
export const saveSong = async (songName: string, token: string, album?: Album) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search?q=' + songName + '&type=track', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const Id = response.data.tracks.items[0].id;
    const song = await DI.em.findOne(Song, { songId: Id });
      if (song === null) {
        const newSong = new Song(response.data.tracks.items[0].name, Id);
        if (typeof album !== 'undefined') {
          newSong.album = album;
          //add the song to the artists
          response.data.tracks.items[0].artists.forEach(async (artist: any) => {
          await saveArtist(artist.name, token, newSong);
          });
        } else {
          //check if the song is part of an album from the spotofy response
          if (typeof response.data.tracks.items[0].album !== 'undefined') {
            const albumId = response.data.tracks.items[0].album.id;
            await saveAlbumById(albumId, token);
          }
        }
      } else {
        if (typeof album !== 'undefined') {
          song.album = album;
          await DI.em.persist(song).flush();
        }
      }
  } catch (error) {
    console.log(error);
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
      }
    }
  } catch (error) {
    console.log(error);
  }
}
          
//upvote song in database
//Given that the song is in the database, this function will always succeed
export const upvoteSong = (songId: string, userId: string) => {
  try {
    DI.em.findOne(Song, { songId: songId }).then((song: any) => {
      if (song !== null) {
        //check if the user has already upvoted the song
        if (song.votesUp.includes(userId)) {
          //if they have, remove their vote
          song.votesUp.splice(song.votesUp.indexOf(userId), 1);
          DI.em.persist(song).flush();
        } else {
          //check if they have downvoted the song
          if (song.votesDown.includes(userId)) {
            //if they have, remove their vote and add their upvote
            song.votesUp.splice(song.votesUp.indexOf(userId), 1);
            song.votesUp.push(userId);
            DI.em.persist(song).flush();
          } else {
            //if they haven't, add their upvote
            song.votesUp.push(userId);
            DI.em.persist(song).flush();
          }
        }
      }
    }).catch((error: any) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

//downvote song in database
//Given that the song is in the database, this function will always succeed
export const downvoteSong = (songId: string, userId: string) => {
  try {
    DI.em.findOne(Song, { songId: songId }).then((song: any) => {
      if (song !== null) {
        //check if the user has already downvoted the song
        if (song.votesDown.includes(userId)) {
          //if they have, remove their vote
          song.votesDown.splice(song.votesDown.indexOf(userId), 1);
          DI.em.persist(song).flush();
        } else {
          //check if they have upvoted the song
          if (song.votesUp.includes(userId)) {
            //if they have, remove their vote and add their downvote
            song.votesUp.splice(song.votesUp.indexOf(userId), 1);
            song.votesDown.push(userId);
            DI.em.persist(song).flush();
          } else {
            //if they haven't, add their downvote
            song.votesDown.push(userId);
            DI.em.persist(song).flush();
          }
        }
      }
    }).catch((error: any) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

//store a post from the user in the database
export const savePost = (body: string, userId: string) => {
  //get the user from the database
  DI.em.findOne(User, { userId: userId }).then((user: any) => {
    if (user !== null) {
      //create a new post
      const newPost = new Post(body);
      //add the user to the post
      newPost.user = user;
      //add the post to the database
      DI.em.persist(newPost).flush();
    }
  }).catch((error: any) => {
    console.log(error);
  });
}

//edit post in database
export const editPost = async (postId: string, body: string) => {
  try {
    const id = new ObjectId(postId);
    DI.em.findOne(Post, { _id : id }).then((post: any) => {
      if (post !== null) {
        post.body = body;
        DI.em.persist(post).flush();
      }
    }).catch((error: any) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

//store a comment from the user in the database
export const saveComment = (body: string, userId: any, postId: any) => {
  //get the post from the database
  const id = new ObjectId(postId);
  DI.em.findOne(Post, { _id : id }).then((post: any) => {
    if (post !== null) {
      //get the user from the database
      DI.em.findOne(User, { userId: userId }).then((user: any) => {
        if (user !== null) {
          //create a new comment
          const newComment = new Comment(body);
          //add the user to the comment
          newComment.user = user;
          //add the comment to the post
          newComment.post = post;
          //add the comment to the database
          DI.em.persist(newComment).flush();
        }
      }).catch((error: any) => {
        console.log(error);
      });
    }
  }).catch((error: any) => {
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
    getToken(code).then(async (response: any) => {
      accessToken = response.access_token;
      refreshToken = response.refresh_token;
      getData(accessToken).then((response: any) => {
        saveUser(response);
      });  
      //saveSong('Laugh now cry later', accessToken).then((response: any) => {
      //});
      saveSong('Off The Grid', accessToken).then((response: any) => {
      });
      const temp = await DI.em.findOne(Song, { title: 'Off The Grid' });
      console.log(temp);
      //saveAlbum('Pluto x Baby Pluto', accessToken).then((response: any) => {
      //});
      //savePost('This is a test post', "yanbocheng01234");
      //saveComment("Random response", "yanbocheng01234", "62407e4c608ffda2726fbc1f")
      //editPost("62407e4c608ffda2726fbc1f", "This is a test post, edited");
      res.redirect('/home');
    });
  }
});

export const CallbackController = router;
export { accessToken , refreshToken };

