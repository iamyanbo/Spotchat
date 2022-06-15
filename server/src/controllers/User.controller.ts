// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DI } from "../server";
import { User } from "../entities";
import { saveUser, updateUser } from "./callback.controller";

// Global Config
export const userController = express.Router();

userController.use(express.json());

const updateAcceptedUsers = async (userId: string, acceptedUser: string) => {
    const user: any = await DI.em.findOne(User, { userId: userId });
    for (let i = 0; i < user.recommendedUsers.length; i++) {
        if (user.recommendedUsers[i].userId === acceptedUser) {
            user.recommendedUsers[i].splice(i, 1);
        }
    }
    user.acceptedUsers.push(acceptedUser);
    await DI.em.persistAndFlush(user);
    return user.recommendedUsers;
}

const updateRejectedUsers = async (userId: string, rejectedUser: string) => {
    const user: any = await DI.em.findOne(User, { userId: userId });
    for (let i = 0; i < user.recommendedUsers.length; i++) {
        if (user.recommendedUsers[i].userId === rejectedUser) {
            user.recommendedUsers.splice(i, 1);
        }
    }
    await DI.em.persist(user).flush();
    return user.recommendedUsers;
}


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
        const birthday = req.body.birthday
        const bio = req.body.bio
        const profilePicture = req.body.profilePicture
        const updatedUser = await updateUser(userId, sex, interestedIn, birthday, bio, profilePicture)
        if (updatedUser !== null) {
            res.status(200).send(`${updatedUser} updated`);
        } } catch (err) {
            res.status(500).json(err)
    }
});

userController.patch("/accepted", async (req: Request, res: Response) => {
    try{
        const userId = req.body.userId;
        const acceptedUserId = req.body.acceptedUserId;
        const updatedUserRecommended = await updateAcceptedUsers(userId, acceptedUserId);
        if (updatedUserRecommended !== null) {
            res.status(200).json(updatedUserRecommended);
        } } catch (err) {
            res.status(500).json(err)
    }   
});

userController.patch("/rejected", async (req: Request, res: Response) => {
    try{
        const userId = req.body.userId;
        const rejectedUserId = req.body.rejectedUserId;
        const updatedUserRecommended = await updateRejectedUsers(userId, rejectedUserId);
        if (updatedUserRecommended !== null) {
            res.status(200).json(updatedUserRecommended);
        } } catch (err) {
            res.status(500).json(err)
    }
});
