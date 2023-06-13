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
  async uploadImage(@Body() imageDto: ImageDto): Promise<User> {
    // Resim yükleme işlemini gerçekleştirin ve kullanıcıya atanacak resim yolunu alın
    const imageUrl = await this.userService.uploadImage(imageDto.userId, imageDto.imagePath);

    // Kullanıcıyı güncelleyin ve resim yolunu kaydedin
    const user = await this.userService.updateUserImage(imageUrl.id, imageUrl.image_path);

    return user;
  }
}
