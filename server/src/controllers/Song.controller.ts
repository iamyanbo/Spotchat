// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { Song } from "../entities";
import { saveSong } from "./callback.controller";

// Global Config
export const songController = express.Router();

songController.use(express.json());

// GET
songController.get("/", async (req: Request, res: Response) => {
    try{
        const songs = await DI.em.find(Song, {})
        res.status(200).json(songs);
    } catch(err) {
        res.status(500).json(err);
    }
});

songController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const song = await DI.em.findOne(Song, query);
        if(song){
            res.status(200).json(song);
        }
    } catch(err) {
        res.status(404).send(`song with id: ${id} not found`);
    }
});
// POST
songController.post("/", async (req: Request, res: Response) => {
    try{
        const name = req.body.name;
        const token = req.body.token;
        const song = await saveSong(name, token);
        res.status(201).send(`${song} created`);
    } catch(err) {
        res.status(500).json(err);
    }
});
