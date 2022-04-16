import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Artist } from "./Artist";
import { BaseEntity } from "./BaseEntity";
import { Song } from "./Song";

@Entity()
export class Album extends BaseEntity {
    @Property()
    name: string;

    @Property()
    albumId: any;

    @ManyToMany(() => Artist, artist => artist.albums)
    artists = new Collection<Artist>(this);

    @OneToMany('Song', 'album')
    songs = new Collection<Song>(this);

    constructor(name: string, albumId: string) {
        super();
        this.name = name;
        this.albumId = albumId;
    }
}