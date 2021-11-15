import { IsString } from 'class-validator';

class ChangePasswordDto {
  @IsString()
  public password: string;

  @IsString()
  public newPassword: string;

  @IsString()
  public confirmPassword: string;

}

export default ChangePasswordDto;
