import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Artist } from "../entities";
import { DI } from "../server";
import { saveArtist } from "./callback.controller";

// Global Config
export const artistController = express.Router();

artistController.use(express.json());

// GET
artistController.get("/", async (req: Request, res: Response) => {
    try{
        //get all artists
        const artists = await DI.em.find(Artist, {})
        res.status(200).json(artists);
    } catch(err) {
        res.status(500).json(err);
    }
});

artistController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const artist = await DI.em.findOne(Artist, query);

        if(artist){
            res.status(200).json(artist);
        }
    } catch(err) {
        res.status(404).send(`artist with id: ${id} not found`);
    }
});
// POST
artistController.post("/", async (req: Request, res: Response) => {
    try{
        const newartistName = req.body.name;
        const token = req.body.token;
        const artist = await saveArtist(newartistName, token);
        if (artist) {
            res.status(201).send(`${artist} created`);
        } else {
            res.status(200).send(`artist with name: ${newartistName} already exists`);
        }
    } catch(err) {
        res.status(500).json(err);
    }
});
