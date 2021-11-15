import * as express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as cors from 'cors';
import * as helmet from 'helmet';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({extended: true }));
    this.app.use("/uploads",express.static(path.join(__dirname,"../uploads")));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const {
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb://${MONGO_PATH}`);
  }
}

export default App;
