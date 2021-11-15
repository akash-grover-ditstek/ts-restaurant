import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import ProductModel from './product.model';
import ProductDTO from './product.dto';
import validationMiddleware from '../middleware/validation.middleware';
import uploadMiddleware from '../middleware/upload.middleware';
import * as path from 'path';
import * as fs from 'fs';
import RequestWithRestaurant from 'interfaces/requestWithRestaurant.interface';
import * as _ from 'underscore';
class ProductController implements Controller {
  public path = '/api';
  public router = Router();
  private product = ProductModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/products`, authMiddleware, this.getAllProducts)
    this.router.get(`${this.path}/product/:product_id`, authMiddleware, this.getProduct)
    this.router.post(`${this.path}/add-product`, [uploadMiddleware.single('image'), authMiddleware], this.addProduct)
    this.router.patch(`${this.path}/update-product/:product_id`, [uploadMiddleware.single('image'), authMiddleware], this.updateProduct)
    this.router.delete(`${this.path}/delete-product/:product_id`, [authMiddleware], this.deleteProduct)
  }


  private addProduct = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    const productDTO: ProductDTO = request.body;
    try {
      let product: any = [];
      if (request.file && request.file.path)
        productDTO.image = request.protocol + "://" + request.headers.host + "/" + request.file.path.replace(/\\/g, "/");
      else
        productDTO.image = null;
      if (await this.product.findOne({ name: productDTO.name, restaurant: request.restaurant._id })) {
        throw new Error("Product Already Exists")
      }
      productDTO.category = _.uniq(productDTO.category);
      const prod = await this.product.create({ ...productDTO, restaurant: request.restaurant._id });
      product.push(prod);
      response.json({ data: product });
    } catch (error) {
      if (productDTO.image)
        fs.unlinkSync(path.join(__dirname, "../../uploads/", path.basename(productDTO.image)));
      next(error);
    }
  }

  private updateProduct = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    const productDTO: ProductDTO = request.body;
    const productId: string = request.params.product_id;
    try {
      let product: any = [];
      if (request.file && request.file.path)
        productDTO.image = request.protocol + "://" + request.headers.host + "/" + request.file.path.replace(/\\/g, "/");
      else
        delete productDTO.image;
      delete productDTO.restaurant;
      if (await this.product.findOne({ name: productDTO.name, restaurant: request.restaurant._id, _id: { $ne: productId } })) {
        throw new Error("Product Already Exists")
      }
      let validate = await this.product.findOne({ _id: productId, restaurant: request.restaurant._id })
      if (!validate) {
        throw new Error("Invalid product Id")
      }
      productDTO.category = _.uniq(productDTO.category);
      let prod = await this.product.findOneAndUpdate({ _id: productId, restaurant: request.restaurant._id }, productDTO, { new: true, upsert: true }).select("-__v -address._id");
      product.push(prod);
      response.json({ data: product });
    } catch (error) {
      if (productDTO.image)
        fs.unlinkSync(path.join(__dirname, "../../uploads/", path.basename(productDTO.image)));
      next(error);
    }
  }
  private deleteProduct = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    const productId: string = request.params.product_id;
    try {
      let product = await this.product.findOne({ _id: productId, restaurant: request.restaurant._id })
      if (!product) {
        throw new Error("Invalid product Id")
      }
      await this.product.findOneAndDelete({ _id: productId, restaurant: request.restaurant._id });
      fs.unlinkSync(path.join(__dirname, "../../uploads/", path.basename(product.image)));
      response.json({ data: [{ message: "Product Deleted" }] });
    } catch (error) {
      next(error);
    }
  }


  private getAllProducts = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    try {
      const productData = await this.product.find({ restaurant: request.restaurant._id }).lean()
      if (productData) {
        response.json({ "data": productData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }

  private getProduct = async (request: RequestWithRestaurant, response: Response, next: NextFunction) => {
    try {
      const productData = await this.product.find({ restaurant: request.restaurant._id, _id: request.params.product_id }).lean()
      if (productData) {
        response.json({ "data": productData });
      }
    } catch (err) {
      next(new Error(err.message))
    }
  }

}

export default ProductController;
