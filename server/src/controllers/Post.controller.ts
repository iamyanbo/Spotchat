// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { Post } from "../entities";
import { savePost } from "./callback.controller";

// Global Config
export const postController = express.Router();

postController.use(express.json());

// GET
postController.get("/", async (req: Request, res: Response) => {
    try{
        const posts = await DI.em.find(Post, {})
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
});

postController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const post = await DI.em.findOne(Post, query);

        if(post){
            res.status(200).json(post);
        }
    } catch(err) {
        res.status(404).send(`post with id: ${id} not found`);
    }
});
// POST
postController.post("/", async (req: Request, res: Response) => {
    try{
        const body = req.body.body;
        const userId = req.body.userId;
        await savePost(body, userId);
        res.status(201).send(`post created`);
    } catch(err) {
        res.status(500).json(err);
    }
});
