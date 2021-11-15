import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithRestaurant from '../interfaces/requestWithRestaurant.interface';
import authMiddleware from '../middleware/auth.middleware';
import restaurantModel from './restaurant.model';
import RestaurantDto from './restaurant.dto';
import productModel from '../products/product.model';
import validationMiddleware from '../middleware/validation.middleware';
import uploadMiddleware from '../middleware/upload.middleware';
import * as path from 'path';
import * as fs from 'fs';
import RestaurantWithThatEmailAlreadyExistsException from '../exceptions/RestaurantWithThatEmailAlreadyExistsException';

class RestaurantController implements Controller {
  public path = '/api';
  public router = Router();
  private restaurant = restaurantModel;
  private product = productModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.patch(`${this.path}/update-restaurant`, [authMiddleware, uploadMiddleware.single('image')], this.updateRestaurant);
    this.router.get(`${this.path}/restaurants`, this.getAllRestaurants);
    this.router.get(`${this.path}/restaurant/:id`, this.getRestaurant);
    this.router.get(`${this.path}/restaurant/:id/products`, this.getRestaurantAllProducts);
    this.router.get(`${this.path}/restaurant/:id/product/:product_id`, this.getRestaurantProduct);
  }

  private updateRestaurant = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    const restaurantDto: RestaurantDto = request.body;
    try {
      if (request.file && request.file.path)
        restaurantDto.image = request.protocol + "://" + request.headers.host + "/" + request.file.path.replace(/\\/g, "/");
      else
        delete restaurantDto.image;
      delete restaurantDto.password;
      let emailCheck = await this.restaurant.findOne({ email: restaurantDto.email, _id: { $ne: request.restaurant._id } });
      if (emailCheck) {
        throw new RestaurantWithThatEmailAlreadyExistsException(restaurantDto.email);
      }
      let result = await this.restaurant.findOneAndUpdate({ _id: request.restaurant._id }, restaurantDto, { new: true, upsert: true }).select("-password -__v -address._id");
      response.json({ data: [result] });
    } catch (error) {
      if (restaurantDto.image)
        fs.unlinkSync(path.join(__dirname, "../../uploads/", path.basename(restaurantDto.image)));
      next(error);
    }
  }

  private getAllRestaurants = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const restaurantData = await this.restaurant.find({}).lean()
      if (restaurantData) {
        response.json({ "data": restaurantData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }

  private getRestaurant = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const restaurantData = await this.restaurant.find({ _id: request.params.id }).lean()
      if (restaurantData) {
        response.json({ "data": restaurantData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }

  private getRestaurantAllProducts = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productData = await this.product.find({restaurant:request.params.id}).lean()
      if (productData) {
        response.json({ "data": productData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }

  private getRestaurantProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productData = await this.product.find({restaurant:request.params.id,_id: request.params.product_id }).lean()
      if (productData) {
        response.json({ "data": productData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }
}

export default RestaurantController;
