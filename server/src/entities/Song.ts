import { Entity, IntegerType, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import internal from "stream";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Song extends BaseEntity {
    @Property()
    title: string;

    @Property()
    votesUp: number;

    @Property()
    votesDown: number;

    constructor(title: string) {
        super();
        this.title = title;
        this.votesUp = 0;
        this.votesDown = 0;
    }
}
