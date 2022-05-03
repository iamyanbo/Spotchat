import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Song extends BaseEntity {
    @Property()
    title: string;

    @Property()
    songId: any;

    @Property()
    //stores userID of users who voted up
    votesUp: [];

    @Property()
    //stores userID of users who voted down
    votesDown: [];

    @ManyToOne()
    album?: Album;

    @ManyToMany(() => Artist, artist => artist.songs)
    artists = new Collection<Artist>(this);
    
    constructor(title: string, songId: string) {
        super();
        this.title = title;
        this.songId = songId;
        this.votesUp = [];
        this.votesDown = [];
    }
}
