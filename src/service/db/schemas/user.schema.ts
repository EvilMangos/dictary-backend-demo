import { SchemaFactory } from "@nestjs/mongoose";
import { UserDto } from "../../../utils/dto/user.dto";

export const UserSchema = SchemaFactory.createForClass(UserDto);
