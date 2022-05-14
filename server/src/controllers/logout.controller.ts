import express, { Request, Response } from "express";

export const logoutController = express.Router();
const stateKey = 'spotify_auth_state';

logoutController.get("/", async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie(stateKey);
        res.redirect("/");

        //TODO: iframe to logout from spotify
    } catch (err) {
        res.status(500).json(err);
    }
});