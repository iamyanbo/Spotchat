import express, { Request, Response } from "express";
import { pusher } from "../server";

// Global Config
export const PusherAuthController = express.Router();
PusherAuthController.use(express.json());

//POST
PusherAuthController.post("/", (req: Request, res: Response) => {
    const socketId = req.body.socketId;
    const channel = req.body.channel;
    const authResponse = pusher.authenticate(socketId, channel);
    res.status(201).send(authResponse);
});

