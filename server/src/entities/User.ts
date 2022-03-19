import { Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @Property()
  userId: string;

  @Property()
  about: any;

  @Property()
  playlists: any;

  @Property()
  albums: any;

  @Property()
  topTracks: any;

  constructor(userId: string, about: any, playlists: any, albums: any, topTracks: any) {
    super();
    this.userId = userId;
    this.about = about;
    this.playlists = playlists;
    this.albums = albums;
    this.topTracks = topTracks;

  }
}
