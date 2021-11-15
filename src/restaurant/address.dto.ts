import { IsString } from 'class-validator';

class AddressDto {
  @IsString()
  public street: string;
  @IsString()
  public city: string;
  @IsString()
  public country: string;
}

export default AddressDto;
