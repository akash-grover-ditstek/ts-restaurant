import { NextFunction, Request, Response, Router } from 'express';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import RestaurantDto from '../restaurant/restaurant.dto';
import restaurantModel from './../restaurant/restaurant.model';
import LogInDto from './authentication.dto';
import AuthenticationService from './authentication.service';
import Token from '../common/token.service';
import uploadMiddleware from '../middleware/upload.middleware';
import authMiddleware from '../middleware/auth.middleware';
import ChangePasswordDto from '../dto/changePassword.dto';
import RequestWithRestaurant from '../interfaces/requestWithRestaurant.interface';

class AuthenticationController implements Controller {
  public path = '/api';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private restaurant = restaurantModel;
  public commonService = new Token();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, [uploadMiddleware.single('image'), validationMiddleware(RestaurantDto)], this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/change-password`, [authMiddleware, validationMiddleware(ChangePasswordDto)], this.changePassword);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const restaurantDto: RestaurantDto = request.body;
    try {
      if (request.file && request.file.path)
        restaurantDto.image = request.protocol + "://" + request.headers.host + "/" + request.file.path.replace(/\\/g, "/");
      else
        restaurantDto.image = null;
      const {
        tokenData,
      } = await this.authenticationService.register(restaurantDto);
      response.json({ data: tokenData });
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const restaurantData = await this.restaurant.findOne({ email: logInData.email });
    if (restaurantData) {
      const isPasswordMatching = await this.commonService.compareHash(logInData.password, restaurantData.get('password', null, { getters: false }))
      if (isPasswordMatching) {
        const tokenData = this.commonService.createToken(restaurantData)
        response.json({ tokenData });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private changePassword = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    try {

      const changePasswordDto: ChangePasswordDto = request.body;
      const match = await this.commonService.compareHash(changePasswordDto.password, request.restaurant.password);
      if (!match) {
        throw new Error("Invalid Password")
      } else if (changePasswordDto.newPassword != changePasswordDto.confirmPassword) {
        throw new Error("New Password and Confirm Password Didn't Match");
      } else if (changePasswordDto.password == changePasswordDto.newPassword) {
        throw new Error("New Password and Old Password can't be same");
      } else {
        let password = await this.commonService.createHash(changePasswordDto.newPassword);
        await this.restaurant.updateOne({ "_id": request.restaurant._id }, {password });
        response.json({ data: [{ "message": "success" }] })
      }

    } catch (err) {
      next(new Error(err.message))
    }
  }

}

export default AuthenticationController;
