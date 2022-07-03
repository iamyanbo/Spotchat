import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Channel } from "./Channel";

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
  sex: string;

  @Property({type: String})
  InterestedIn: string;

  @Property({type: Date})
  birthday: Date;

  @Property({type: String})
  bio: string;

  @Property({type: String})
  profilePicture: string;

  @ManyToMany(() => User)
  recommendedUsers = new Collection<User>(this);

  @ManyToMany(() => User)
  acceptedUsers = new Collection<User>(this);

  @ManyToMany(() => User)
  rejectedUsers = new Collection<User>(this);

  @ManyToMany(() => User)
  matchedUsers = new Collection<User>(this);

  @Property({type: "String"})
  accessToken: string;

  @Property({type: "String"})
  refreshToken: string;
  
  @Property({type: Array})
  channels = new Array<Channel>();

  constructor(userId: string, aboutMe: Object, albums: Object, playlists: Object, topTracks: Object
    , accessToken: string, refreshToken: string) {
    super();
    this.userId = userId;
    this.aboutMe = aboutMe;
    this.albums = albums;
    this.playlists = playlists;
    this.topTracks = topTracks;
    this.sex = "";
    this.InterestedIn = "";
    this.birthday = new Date(2000, 1, 1);
    this.bio = "";
    this.profilePicture = "";
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.channels = new Array<Channel>();
  }
}
