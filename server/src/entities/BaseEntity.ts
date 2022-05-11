import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
  @PrimaryKey({ type: ObjectId })
  _id!: ObjectId;

  @SerializedPrimaryKey({ type: "String" })
  id!: string;

  @Property( {type: Date })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: Date })
  updatedAt = new Date();
}
