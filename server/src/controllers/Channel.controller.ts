import { ObjectId } from "@mikro-orm/mongodb";
import express, { Request, Response } from "express";
import { Channel, User } from "../entities";
import { DI } from "../server";
import { io } from "../server";

// Global Config
export const ChannelController = express.Router();
ChannelController.use(express.json());

// GET
ChannelController.get("/:id", async (req: Request, res: Response) => {
    try {
        const channelId = req.params.id;
        const channel = await DI.em.findOne(Channel, { channelId: channelId });
        if (channel) {
            res.status(200).json(channel);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// POST
ChannelController.post("/", async (req: Request, res: Response) => {
    try {
        const channelId = req.body.channelId;
        const userId1 = req.body.userId1;
        const userId2 = req.body.userId2;
        const channel = await DI.em.findOne(Channel, { channelId: channelId });
        if (channel) {
            res.status(200).json(channel);
        } else {
            const newChannel = new Channel(channelId);
            const user1 = await DI.em.findOne(User, { _id: new ObjectId(userId1) });
            const user2 = await DI.em.findOne(User, { _id: new ObjectId(userId2) });
            if (user1 && user2) {
                newChannel.users.add(user1);
                newChannel.users.add(user2);
            } else {
                res.status(404).send(`user with id: ${userId1} or ${userId2} not found`);
            }
            await DI.em.persistAndFlush(newChannel);
            res.status(201).json(newChannel);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// PATCH
ChannelController.patch("/", async (req: Request, res: Response) => {
    const message = req.body.message;
    const channelId = req.body.channelId;
    const channel = await DI.em.findOne(Channel, { channelId: channelId });
    io.emit(channelId, message);
    if (channel) {
        channel.messages.push(message);
        DI.em.persistAndFlush(channel);
        res.status(200).json(channel.messages);
    } else {
        res.status(404).send(`channel with id: ${channelId} not found`);
    }
});