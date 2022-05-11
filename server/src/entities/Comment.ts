import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
    @Property({ type: "String" })
    body: string;

    @Property({ type: Array })
    likes: string[];

    @ManyToOne({ type: Post })
    post!: Post;

    @ManyToOne({ type: User })
    user!: User;
    
    constructor(body: string) {
        super();
        this.likes = [];
        this.body = body;
    }
}
