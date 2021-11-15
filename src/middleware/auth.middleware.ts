import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import requestWithRestaurant from '../interfaces/requestWithRestaurant.interface';
import restaurantModel from '../restaurant/restaurant.model';

async function authMiddleware(request: requestWithRestaurant, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.split("Bearer ").pop() || null;
  if (token) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const restaurant = await restaurantModel.findById(id).lean();
      if (restaurant) {
        request.restaurant = restaurant;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
