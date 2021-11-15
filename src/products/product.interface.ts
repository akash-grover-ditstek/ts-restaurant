import { ObjectId } from "mongoose";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: string;
  category: string[];
  restaurant: string,
}

export default Product;
