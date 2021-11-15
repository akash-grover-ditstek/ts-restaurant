import HttpException from './HttpException';

class RestaurantWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `Restauratn with email ${email} already exists`);
  }
}

export default RestaurantWithThatEmailAlreadyExistsException;
