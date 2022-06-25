import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { AuthController, CallbackController, userController, albumController, artistController, songController, logoutController, recommendationController } from "./controllers";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import { User } from "./entities";
import cookieParser from 'cookie-parser';
import { Db } from "mongodb";
import Pusher from "pusher";
import { MessageController } from "./controllers/Message.controller";
import { PusherAuthController } from "./controllers/PusherAuth.controller";

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;

export const pusher = new Pusher({
  appId: process.env.app_id!,
  key: process.env.key!,
  secret: process.env.secret!,
  cluster: process.env.cluster!,
  encrypted: true,
});

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true , limit: "50mb" }));
  app.use(cors());


  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get("/", (req, res) => res.json({ message: `hello`}));
  app.get('/home', (req, res) => res.json({ message: `home ${req.cookies.accessToken}`}));
  // Define and attach the routes to the main app.
  app.use("/users", userController)
  app.use("/albums", albumController)
  app.use("/artists", artistController)
  app.use("/songs", songController)
  app.use("/auth", AuthController);
  app.use("/callback", CallbackController);
  app.use("/logout", logoutController);
  app.use("/recommendations", recommendationController);
  app.use("/messages", MessageController);
  app.use("/pusher/auth", PusherAuthController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  // console.log that your server is up and running
  DI.server = app.listen(port, () => console.log(`Listening on port ${port}`));
})();

