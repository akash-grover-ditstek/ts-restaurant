import { v4 as uuidv4 } from 'uuid';
import requestWithRestaurant from '../interfaces/requestWithRestaurant.interface';
import * as multer from 'multer';
import * as path from 'path';

const storage = multer.diskStorage({
  destination: function (req: requestWithRestaurant, file: any, cb: any) {
    cb(null, './uploads/')
  },

  filename: function (req, file, cb) {
    if(file)
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});


const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
}

const uploadMiddleware = multer({ storage: storage, fileFilter: fileFilter });

export default uploadMiddleware;
