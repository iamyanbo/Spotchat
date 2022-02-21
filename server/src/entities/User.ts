import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

// TODO: Fix properties to what makes sense for spotify oauth

@Entity()
export class User extends BaseEntity {
  @Property()
  username: string;

  @Property()
  password: string;

  @Property()
  email: string;

  constructor(username: string, password: string, email: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
