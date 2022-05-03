import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { AuthController, CallbackController, accessToken } from "./controllers";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import { User } from "./entities";
import cookieParser from 'cookie-parser';

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get("/", (req, res) => res.json({ message: `hello`}));
  app.get('/home', (req, res) => res.json({ message: `home ${accessToken}`}));
  // Define and attach the routes to the main app.
  app.use("/auth", AuthController);
  app.use("/callback", CallbackController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  // console.log that your server is up and running
  DI.server = app.listen(port, () => console.log(`Listening on port ${port}`));
})();
