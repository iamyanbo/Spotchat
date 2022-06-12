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

  @Property({type: String})
  sex!: string;

  @Property({type: String})
  InterestedIn!: string;

  @Property({type: "String"})
  accessToken: string;

  @Property({type: "String"})
  refreshToken: string;

  constructor(userId: string, aboutMe: Object, albums: Object, playlists: Object, topTracks: Object
    , accessToken: string, refreshToken: string) {
    super();
    this.userId = userId;
    this.aboutMe = aboutMe;
    this.albums = albums;
    this.playlists = playlists;
    this.topTracks = topTracks;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
