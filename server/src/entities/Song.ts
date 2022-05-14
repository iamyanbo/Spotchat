import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Song extends BaseEntity {
    @Property({ type: "String" })
    title: string;

    @Property({ type: "String" })
    songId: string;

    @ManyToOne({ type: Album })
    album?: Album;

    @ManyToMany(() => Artist, artist => artist.songs)
    artists = new Collection<Artist>(this);
    
    constructor(title: string, songId: string) {
        super();
        this.title = title;
        this.songId = songId;
    }
}
