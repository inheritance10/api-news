import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import _default from "ts-jest";
import { ExceptionHandler } from "@nestjs/core/errors/exception-handler";

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
    if(!user){
      throw new NotFoundException('User not found')
    }
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

  async updateProfile(
    userId: string,
    email?: string,
    name?: string,
    about?: string,
    gender?: string
  ): Promise<User | NotFoundException> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          email: email || '',
          name: name || '',
          about: about || '',
          gender: gender || ''
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NotFoundException("User not found");
    }

    return updatedUser;
  }





  async updateUserImage(userId: string, imageUrl: string): Promise<User> {
    const isAccountSuspended = await this.userModel.findOne({where : userId});

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
