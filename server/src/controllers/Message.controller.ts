import express, { Request, Response } from "express";
import { pusher } from "../server";

// Global Config
export const MessageController = express.Router();
MessageController.use(express.json());

//POST
MessageController.post("/", (req: Request, res: Response) => {
    const payload = req.body;
    pusher.trigger("chat", "message", payload);
    res.status(201).send(payload);
});