import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Song } from "./Song";
import { Album } from "./Album";

@Entity()
export class Artist extends BaseEntity {
    @Property()
    name: string;

    @Property()
    artistId: any;

    @ManyToMany(() => Album, album => album.artists, { owner: true })
    albums = new Collection<Album>(this);

    @ManyToMany(() => Song, Song => Song.artists, { owner: true })
    songs = new Collection<Song>(this);

    constructor(name: string, artistId: string) {
        super();
        this.name = name;
        this.artistId = artistId;
    }
}