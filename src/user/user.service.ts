import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import _default from "ts-jest";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async users(): Promise<string> {
    const users = await this.userModel.find();
    return JSON.stringify(users);
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const { name, email, password } = signupDto;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword
    });

    return user;
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const hashPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });

    return updatedUser;
  }

  async uploadImage(userId: string, imagePath: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, { image: imagePath }, { new: true });

    return updatedUser;
  }

  async updateUserImage(userId: string, imageUrl: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    return updatedUser;
  }

}
