import HttpException from './HttpException';

class RestaurantNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Restaurant with id ${id} not found`);
  }
}

export default RestaurantNotFoundException;
