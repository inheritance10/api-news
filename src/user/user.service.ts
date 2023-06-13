import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    return user;
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

  async uploadImage(userId: string, imagePath: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, { image: imagePath }, { new: true });

    return updatedUser;
  }

  async updateUserImage(userId: string, imageUrl: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { image_path: imageUrl },
      { new: true }
    );

    return updatedUser;
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel.findByIdAndUpdate(userId, { password: hashPassword });
  }

  async accountStop(userId: string, status: boolean): Promise<{message: string}> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === status) {
      const errorMessage = !status ? 'Account is already suspended' : 'Account is already active';
      throw new BadRequestException(errorMessage);
    }

    user.status = status;
    await user.save();

    const message = !status ? 'Account has been suspended' : 'Account has been reactivated';
    return { message };
  }


}
