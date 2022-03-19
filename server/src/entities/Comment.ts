import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Comment extends BaseEntity {
    @Property()
    body: string;

    constructor(body: string) {
        super();
        this.body = body;
    }
}
