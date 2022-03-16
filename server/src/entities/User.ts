import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

// TODO: Fix properties to what makes sense for spotify oauth

@Entity()
export class User extends BaseEntity {
  @Property()
  aboutMe: any

  @Property()
  albums: any;

  @Property()
  playlists: any;

  @Property()
  topTracks: any;



  constructor(username: string, password: string, email: string) {
    super();
  }
}
