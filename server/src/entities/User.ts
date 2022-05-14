import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @Property({type: "String"})
  userId: string;

  @Property({type: Object})
  aboutMe: Object

  @Property({type: Object})
  albums: Object;

  @Property({type: Object})
  playlists: Object;

  @Property({type: Object})
  topTracks: Object;

  constructor(userId: string, aboutMe: Object, albums: Object, playlists: Object, topTracks: Object) {
    super();
    this.userId = userId;
    this.aboutMe = aboutMe;
    this.albums = albums;
    this.playlists = playlists;
    this.topTracks = topTracks;
  }
}
