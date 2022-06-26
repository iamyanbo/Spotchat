import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

interface message {
    user: {
        userId: string;
        name: string;
        avatar: string;
    }
    message: string;
    timestamp: Date;
}

@Entity()
export class Channel extends BaseEntity {

    @Property({ type: "String" })
    channelId: string;
    
    @ManyToMany(() => User, user => user.channels, {owner: true})
    users = new Collection<User>(this);

    @Property({ type: Array })
    messages: Array<message>;


    constructor(channelId: string) {
        super();
        this.channelId = channelId;
        this.messages = new Array<message>();
    }
}