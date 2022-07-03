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

    //Not many to many because updating the channels will take too long and 
    //the frontend calls to get the users at the start anyways, so we can just store it as their objectId's
    @Property({ type: Array })
    users: Array<string>;

    @Property({ type: Array })
    messages: Array<message>;


    constructor(channelId: string) {
        super();
        this.channelId = channelId;
        this.messages = new Array<message>();
        this.users = new Array<string>();
    }
}