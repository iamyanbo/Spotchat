import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
    @Property()
    body: string;

    @Property()
    likes: string[];

    @ManyToOne()
    post!: Post;

    @ManyToOne()
    user!: User;
    
    constructor(body: string) {
        super();
        this.likes = [];
        this.body = body;
    }
}
