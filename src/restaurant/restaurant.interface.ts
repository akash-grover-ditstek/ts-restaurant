interface Restaurant {
  _id: string;
  name: string;
  image: string;
  email: string;
  password: string;
  timing:string[],
  address: {
    street: string,
    city: string,
  };
}

export default Restaurant;
