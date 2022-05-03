import { Entity, ManyToOne, OneToMany, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
    @Property()
    body: string;

    @Property()
    likes: string[];

    @ManyToOne()
    user!: User;
    
    @OneToMany('Comment', 'post')
    comments = new Collection<Comment>(this);

    constructor(body: string) {
        super();
        this.body = body;
        this.likes = [];
    }
}
