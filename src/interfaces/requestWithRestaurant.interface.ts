import { Request } from 'express';
import Restaurant from '../restaurant/restaurant.interface';

interface RequestWithRestaurant extends Request {
  restaurant: Restaurant;
}

export default RequestWithRestaurant;
