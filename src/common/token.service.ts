import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from "interfaces/dataStoredInToken";
import TokenData from "interfaces/tokenData.interface";
import Restaurant from "restaurant/restaurant.interface";

export default class Token {

  public createToken(restaurant: Restaurant): TokenData {
    const expiresIn = 60 * 60 * 24; // an day
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: restaurant._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async createHash(plainText: string) : Promise<string> {
    return bcrypt.hash(plainText, 10);
  }

  public async compareHash(plainText: string, hashText: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(
      plainText,
      hashText,
    );
    return isMatched;
  }
}