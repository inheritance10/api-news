import { Controller,Post,Body ,Get} from '@nestjs/common';
import { UserService } from "./user.service";
import {SignupDto} from "./dto/signup.dto";
import { User } from "./schema/user.schema";
import { ImageDto } from "./dto/image.dto";

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get()
  async user(@Body() signupDto: SignupDto): Promise<string>
  {
    return this.userService.users();
  }
  @Post('/signup')
  async signUp(@Body() signupDto: SignupDto): Promise<User>
  {
    return this.userService.signup(signupDto);
  }

  @Post('/upload-image')
  async uploadImage(@Body() imageDto: ImageDto): Promise<{ userName: string, imagePath: string, message: string }> {

    // Kullanıcının adını alın
    const user = await this.userService.getUserById(imageDto.userId);
    const userName = user.name;

    // Kullanıcıyı güncelleyin ve resim yolunu kaydedin
    const updatedUser = await this.userService.updateUserImage(imageDto.userId, imageDto.image_path);

    if (updatedUser) {
      return {
        userName: userName,
        imagePath: updatedUser.image_path,
        message: 'Resim yükleme başarılı'
      };
    } else {
      return {
        userName: userName,
        imagePath: '',
        message: 'Resim yükleme başarısız'
      };
    }
  }

}
