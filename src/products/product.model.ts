import * as mongoose from 'mongoose';
import Product from './product.interface';


const productSchema = new mongoose.Schema(
  {
    name: String,
    price: String,
    image: String,
    category:[String],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'restaurant',
    }
  }
);


const productModel = mongoose.model<Product & mongoose.Document>('product', productSchema);

export default productModel;
