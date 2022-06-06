import { Request, Response, Router } from "express";
import { DI } from "../server";
import axios from "axios";
import { User } from "../entities";

const getRelatedArtistsMusic = async (artistId: string, popularity: number, songId: string, accessToken: string) => {
    const response = await axios.get('https://api.spotify.com/v1/artists/' + artistId + '/related-artists', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
            }
        });
    //get the top 5 related artists
    const relatedArtists = response.data.artists.slice(0, 5);
    //get artists top tracks
    const relatedArtistsTracks = await Promise.all(relatedArtists.map(async (artist: any) => {
        const response = await axios.get('https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        return response.data.tracks;
    }
    ));
    //get the tracks with a popularity within 5 points of "popularity"
    const relatedArtistsTracksPopularity = relatedArtistsTracks.map((tracks: any) => {
        return tracks.filter((track: any) => {
            return Math.abs(track.popularity - popularity) <= 5;
        });
    });
    //get the tracks that are not the same as the songId and also sort by popularity
    const relatedTracks = relatedArtistsTracksPopularity.map((tracks: any) => {
        return tracks.filter((track: any) => {
            return track.id !== songId;
        }).sort((a: any, b: any) => {
            return b.popularity - a.popularity;
        });
    });
    //shrink the array to the top 5
    const relatedTracksShrinked = relatedTracks.map((tracks: any) => {
        return tracks.slice(0, 5);
    }
    );
    return relatedTracksShrinked;
}

const getRelatedUsers = async (relatedMusic: any) => {
    //get the users that have the same music in their top tracks
    const users = await DI.em.find(User, {});
    const usersWithMusic = users.filter((user: any) => {
        return user.topTracks.some((track: any) => {
            return relatedMusic.some((relatedTrack: any) => {
                return track.id === relatedTrack.id;
            });
        });
    });
}