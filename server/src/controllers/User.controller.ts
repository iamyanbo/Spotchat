// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { User } from "../entities";
import { saveUser, updateUser } from "./callback.controller";

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
    const userId = req?.params.id;
    try{
        const user = await DI.em.findOne(User, { userId: userId });
        if(user){
            res.status(200).json(user);
        }
    } catch(err) {
        res.status(404).send(`user with id: ${userId} not found`);
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

// PATCH
userController.patch("/", async (req: Request, res: Response) => {
    try{
        const userId = req.body.userId;
        const sex = req.body.sex;
        const interestedIn = req.body.interestedIn;
        const updatedUser = await updateUser(userId, sex, interestedIn)
        if (updatedUser !== null) {
            res.status(200).send(`${updatedUser} updated`);
        } } catch (err) {
            res.status(500).json(err)
    }
});

