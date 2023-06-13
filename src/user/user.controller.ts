import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common";
import { UserService } from "./user.service";
import {SignupDto} from "./dto/signup.dto";
import { User } from "./schema/user.schema";
import { ImageDto } from "./dto/image.dto";
import { PasswordChangeDto } from "./dto/passwordChange.dto";
import { AccountDto } from "./dto/account.dto";

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

  @Post('/password-update')
  async passwordUpdate(
    @Body() passwordDto: PasswordChangeDto
  ): Promise<{message: string}> {
    const { userId, currentPassword, newPassword } = passwordDto;
    try {
      await this.userService.updatePassword(userId, currentPassword, newPassword);
      return {
        message: 'Şifreniz başarıyla güncellendi'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid current password');
      } else {
        throw new InternalServerErrorException('An error occurred');
      }
    }
  }

  @Post('/account_stop')
  async account_stop(
    @Body() accountDto: AccountDto
  ): Promise<{ message : string }> {
    const userId = accountDto.userId;
    const status = true; // Hesabın durdurulacağı durum, burada sabit olarak true olarak varsayıldı. İsteğe bağlı olarak dinamik olarak değiştirilebilir.

    try {
      const message = await this.userService.accountStop(userId, accountDto.status);
      return message;
    } catch (error) {
      throw new InternalServerErrorException('Hesap durdurulurken bir hata oluştu' + ' ' + error.message);
    }
  }

}
