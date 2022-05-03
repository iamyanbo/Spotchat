import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { BaseEntity, User , Song, Artist, Post, Album, Comment } from "./entities";

const options: Options = {
  type: "mongo",
  entities: [BaseEntity, User, Song, Artist, Post, Album, Comment],
  dbName: "spotify-community-db",
  highlighter: new MongoHighlighter(),
  debug: true,
};

export default options;
