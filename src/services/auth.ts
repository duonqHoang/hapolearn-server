import bcript from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findExistedUser,
  findUserByUsername,
  registerUser,
} from "../repositories/user";

const register = async (username: string, email: string, password: string) => {
  const existedUser = await findExistedUser(username, email);
  if (existedUser) {
    console.log("Username or Email is already used!");
    throw new Error("Username or Email is already used!");
  }

  const hashed = await bcript.hash(password, +process.env.BC_SALT_ROUNDS);
  const newUser = await registerUser(username, email, hashed);
  if (newUser) {
    console.log("Registered new user!");
    return newUser;
  } else {
    console.log("Error creating new user!");
    throw new Error("Error creating new user!");
  }
};

const login = async (email: string, password: string) => {
  const user = await findUserByUsername(email);
  if (!user) {
    const message: string = "A user with this username could not be found!";
    console.log(message);
    throw new Error(message);
  }

  const match = await bcript.compare(password, user.password);
  if (!match) {
    const message: string = "Password is incorrect";
    console.log(message);
    throw new Error(message);
  }

  const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

export { register, login };
