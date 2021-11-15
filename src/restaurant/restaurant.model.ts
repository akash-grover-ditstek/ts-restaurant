import * as mongoose from 'mongoose';
import Restaurant from './restaurant.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String,
});

const restaurantSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    image: String,
    timing: [String],
    password: {
      type: String,
      get: (): undefined => undefined,
    },
    address: addressSchema
  }
);


const restaurantModel = mongoose.model<Restaurant & mongoose.Document>('restaurant', restaurantSchema);

export default restaurantModel;
