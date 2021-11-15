import { isNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import AddressDto from './address.dto';

class ResaturantDto {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public image: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public timing: string[];

  @ValidateNested()
  public address: AddressDto;
}

export default ResaturantDto;
