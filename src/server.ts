import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import RestaurantController from './restaurant/restaurant.controller';
import ProductController from './products/product.controller';
const app = new App(
  [
    new AuthenticationController(),
    new RestaurantController(),
    new ProductController(),
  ],
);

app.listen();
