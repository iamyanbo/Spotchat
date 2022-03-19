import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Post extends BaseEntity {
    @Property()
    title: string;

    @Property()
    body: string;

    constructor(title: string, body: string) {
        super();
        this.title = title;
        this.body = body;
    }
}
