import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Vote extends BaseEntity {
    @Property()
    userId: string;

    @Property()
    vote: number;

    constructor(userId: string, vote: number) {
        super();
        this.userId = userId;
        this.vote = vote;
    }
}
