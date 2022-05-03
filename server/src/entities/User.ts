import { ArrayType, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Comment } from "./Comment";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
  @Property()
  userId: any;

  @Property()
  aboutMe: any

  @Property()
  albums: any;

  @Property()
  playlists: any;

  @Property()
  topTracks: any;

  @OneToMany('Post', 'user')
  posts = new Collection<Post>(this);

  @OneToMany('Comment', 'user')
  comments = new Collection<Comment>(this);

  constructor(userId: string, aboutMe: any, albums: any, playlists: any, topTracks: any) {
    super();
    this.userId = userId;
    this.aboutMe = aboutMe;
    this.albums = albums;
    this.playlists = playlists;
    this.topTracks = topTracks;
  }
}
