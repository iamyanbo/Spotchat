// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { Album } from "../entities";
import { saveAlbum } from "./callback.controller";

// Global Config
export const albumController = express.Router();

albumController.use(express.json());

// GET
albumController.get("/", async (req: Request, res: Response) => {
    try{
        const albums = await DI.em.find(Album, {})
        res.status(200).json(albums);
    } catch(err) {
        res.status(500).json(err);
    }
});

albumController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const album = await DI.em.findOne(Album, query);

        if(album){
            res.status(200).json(album);
        }
    } catch(err) {
        res.status(404).send(`Album with id: ${id} not found`);
    }
});
// POST
albumController.post("/", async (req: Request, res: Response) => {
    try{
        const newAlbumName = req.body.name;
        const token = req.body.token;
        const album = await saveAlbum(newAlbumName, token);
        if (album) {
            res.status(201).send(`${album} created`);
        } else {
            res.status(200).send(`Album with name: ${newAlbumName} already exists`);
        }
    } catch(err) {
        res.status(500).json(err);
    }
});
