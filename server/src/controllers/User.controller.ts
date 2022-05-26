// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { User } from "../entities";
import { saveUser } from "./callback.controller";

// Global Config
export const userController = express.Router();

userController.use(express.json());

// GET
userController.get("/", async (req: Request, res: Response) => {
    try{
        const users = await DI.em.find(User, {})
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

userController.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params.id;
    try{
        const query = { _id: new ObjectId(id) };
        const user = await DI.em.findOne(User, query);

        if(user){
            res.status(200).json(user);
        }
    } catch(err) {
        res.status(404).send(`user with id: ${id} not found`);
    }
});
// POST
userController.post("/", async (req: Request, res: Response) => {
    try{
        const user = req.body;
        const accessToken = req.body.accessToken;
        const refreshToken = req.body.refreshToken;
        const newUser = await saveUser(user, accessToken, refreshToken);
        if (newUser !== null) {
            res.status(201).send(`${newUser} created`);
        } else {
            res.status(200).send(`user with userId: ${user.userId} already exists`);
        }    } catch(err) {
        res.status(500).json(err);
    }
});
