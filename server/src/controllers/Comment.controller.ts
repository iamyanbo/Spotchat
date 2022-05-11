// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { Comment } from "../entities";
import { saveComment } from "./callback.controller";

// Global Config
export const commentController = express.Router();

commentController.use(express.json());

// GET
commentController.get("/", async (req: Request, res: Response) => {
    try{
        const comments = await DI.em.find(Comment, {})
        res.status(200).json(comments);
    } catch(err) {
        res.status(500).json(err);
    }
});

commentController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const comment = await DI.em.findOne(Comment, query);

        if(comment){
            res.status(200).json(comment);
        }
    } catch(err) {
        res.status(404).send(`comment with id: ${id} not found`);
    }
});
// POST
commentController.post("/", async (req: Request, res: Response) => {
    try{
        const postId = req.body.postId;
        const body = req.body.body;
        const userId = req.body.userId;
        await saveComment(postId, body, userId);
        res.status(201).send(`comment created`);
    } catch(err) {
        res.status(500).json(err);
    }
});
