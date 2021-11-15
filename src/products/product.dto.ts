import { isNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongoose';

class ProductDTO {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public image: string;

  @IsString()
  public price: string;

  @IsString()
  public category: string[];

  @IsString()
  public restaurant: string;
}

export default ProductDTO;
