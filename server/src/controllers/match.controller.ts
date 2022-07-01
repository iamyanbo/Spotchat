import { match } from "assert";
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { User } from "../entities";

// Global Config
export const matchController = express.Router();
matchController.use(express.json());

// POST
matchController.post("/isCancelled", async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const otherUserId = req.body.otherUserId;
        const user = await DI.em.findOne(User, { userId: userId });
        const otherUser = await DI.em.findOne(User, { userId: otherUserId });
        if (user && otherUser) {
            if (user.rejectedUsers.contains(otherUser)) {
                res.status(200).json(true);
            } else {
                res.status(200).json(false);
            }
        }
    } catch (err) {
        res.status(500).json(err);
    } 
});

matchController.post("/isCancelled/objectId", async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const otherUserId = req.body.otherUserId;
        const user = await DI.em.findOne(User, { _id: new ObjectId(userId) });
        const otherUser = await DI.em.findOne(User, { _id: new ObjectId(otherUserId) });
        if (user && otherUser) {
            if (user.rejectedUsers.contains(otherUser)) {
                res.status(200).json(true);
            } else {
                res.status(200).json(false);
            }
        }
    } catch (err) {
        res.status(500).json(err);
    } 
});