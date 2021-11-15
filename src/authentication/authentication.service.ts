import ResaturantDto from '../restaurant/restaurant.dto';
import RestaurantModel from '../restaurant/restaurant.model';
import Token from '../common/token.service';
import RestaurantWithThatEmailAlreadyExistsException from '../exceptions/RestaurantWithThatEmailAlreadyExistsException';
import * as fs from 'fs';
import * as path from 'path';
class AuthenticationService {
  public restaurant = RestaurantModel
  private commonService = new Token();
  public async register(restaurantDto: ResaturantDto) {
    try {
      if (
        await this.restaurant.findOne({ email: restaurantDto.email })
      ) {
        throw new RestaurantWithThatEmailAlreadyExistsException(restaurantDto.email);
      }
      const hashedPassword = await this.commonService.createHash(restaurantDto.password);
      
      const restaurant = await this.restaurant.create({
        ...restaurantDto,
        password: hashedPassword,
      });
      const tokenData = this.commonService.createToken(restaurant);
      return {
        tokenData,
      };
    } catch (err) {
      if(restaurantDto.image)
      fs.unlinkSync(path.join(__dirname,"../../uploads/",path.basename(restaurantDto.image)));
      throw err;
    }
  }
}

export default AuthenticationService;
