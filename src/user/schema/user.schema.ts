import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({
  timestamps: true
})

export class User extends Document{
  @Prop()
  name: string;

  @Prop({unique : [true, 'Duplicate email entered']})
  email: string;

  @Prop()
  password : string;

  @Prop()
  about : string;

  @Prop()
  gender : string;

  @Prop()
  image_path : string;

  @Prop()
  status : boolean;
}

export const UserShcema = SchemaFactory.createForClass(User);