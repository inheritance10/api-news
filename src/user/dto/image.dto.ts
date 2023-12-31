import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  image_path: string;

}
