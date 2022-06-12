import express, { Request, Response } from "express";
import { DI } from "../server";
import { User } from "../entities";
import axios from "axios";

// Global Config
export const recommendationController = express.Router();

recommendationController.use(express.json());

export const getRelatedArtistsMusic = async (artistId: string, popularity: number, songId: string, accessToken: string) => {

    const response = await axios.get('https://api.spotify.com/v1/artists/' + artistId + '/related-artists', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
            }
        });
    const relatedArtists = response.data.artists.slice(0,1);
    const relatedArtistsTracks = await Promise.all(relatedArtists.map(async (artist: any) => {
        //axios call to get top tracks with market as ES
        const response = await axios.get('https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?market=ES', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        return response.data.tracks;
    }));
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


export const getRelatedUsers = async (relatedMusic: any) => {
    //get the users that have the same music in their top tracks
    const users = await DI.em.find(User, {});
    const usersWithMusic = users.filter((user: any) => {
        return user.topTracks.items.some((track: any) => {
            return relatedMusic.some((relatedTrack: any) => {
                return track.id === relatedTrack.id;
            });
        });
    });
    return usersWithMusic;
}

//GET
recommendationController.get("/:id", async (req: Request, res: Response) => {
    const userId = req?.params.id;
    try{
        const user = await DI.em.findOne(User, { userId: userId});
        if(user){
            const topTracks: any = user.topTracks
            //get top 5 tracks 
            const top1 = topTracks.items[0]
            const top2 = topTracks.items[1]
            const top3 = topTracks.items[2]
            const top4 = topTracks.items[3]
            const top5 = topTracks.items[4]
            //get the related artists' music of the top 5 tracks
            const relatedMusic1 = await getRelatedArtistsMusic(top1.artists[0].id, top1.popularity, top1.id, user.accessToken);
            const relatedMusic2 = await getRelatedArtistsMusic(top2.artists[0].id, top2.popularity, top2.id, user.accessToken);
            const relatedMusic3 = await getRelatedArtistsMusic(top3.artists[0].id, top3.popularity, top3.id, user.accessToken);
            const relatedMusic4 = await getRelatedArtistsMusic(top4.artists[0].id, top4.popularity, top4.id, user.accessToken);
            const relatedMusic5 = await getRelatedArtistsMusic(top5.artists[0].id, top5.popularity, top5.id, user.accessToken);
            //add top 5 tracks to the related music
            const relatedMusicUse1 = relatedMusic1.concat(top1);
            const relatedMusicUse2 = relatedMusic2.concat(top2);
            const relatedMusicUse3 = relatedMusic3.concat(top3);
            const relatedMusicUse4 = relatedMusic4.concat(top4);
            const relatedMusicUse5 = relatedMusic5.concat(top5);
            //get the users that have the same music in their top tracks
            const users = await getRelatedUsers(relatedMusicUse1);
            const users2 = await getRelatedUsers(relatedMusicUse2);
            const users3 = await getRelatedUsers(relatedMusicUse3);
            const users4 = await getRelatedUsers(relatedMusicUse4);
            const users5 = await getRelatedUsers(relatedMusicUse5);
            //get the users that have the same music in their top tracks
            const usersWithMusic = users.concat(users2).concat(users3).concat(users4).concat(users5);
            const set = new Set(usersWithMusic);
            const usersWithMusicUnique = Array.from(set);
            //remove the user that is the same as the provided user
            const usersWithMusicUniqueFiltered = usersWithMusicUnique.filter((user: any) => {
                return user.userId !== userId;
            });
            //get the top 5 users
            const topUsers = usersWithMusicUniqueFiltered.slice(0, 5);
            res.status(200).json(topUsers);
        }
    } catch(err) {
        console.log(err)
    }
});