import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

// TODO: Fix properties to what makes sense for spotify oauth

@Entity()
export class User extends BaseEntity {
  @Property()
  userId: string;

  @Property()
  aboutMe: any

  @Property()
  albums: any;

  @Property()
  playlists: any;

  @Property()
  topTracks: any;

  constructor(userId: string, aboutMe: any, albums: any, playlists: any, topTracks: any) {
    super();
    this.userId = userId;
    this.aboutMe = aboutMe;
    this.albums = albums;
    this.playlists = playlists;
    this.topTracks = topTracks;
  }
}
