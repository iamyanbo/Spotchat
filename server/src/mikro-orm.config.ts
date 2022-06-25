import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { BaseEntity, User , Song, Artist, Album, Channel } from "./entities";

const options: Options = {
  type: "mongo",
  entities: [BaseEntity, User, Song, Artist, Album, Channel],
  dbName: "spotchat",
  highlighter: new MongoHighlighter(),
  debug: true,
};

export default options;
