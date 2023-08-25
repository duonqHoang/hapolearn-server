import bcript from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, registerUser } from "../repositories/user";

const register = async (name: string, email: string, password: string) => {
  const existedUser = await findUserByEmail(email);
  if (existedUser) {
    console.log("Email is already used!");
    throw new Error("Email is already used!");
  }

  const hashed = await bcript.hash(password, +process.env.BC_SALT_ROUNDS);
  const newUser = await registerUser(name, email, hashed);
  if (newUser) {
    console.log("Registered new user!");
    return newUser;
  } else {
    console.log("Error creating new user!");
    throw new Error("Error creating new user!");
  }
};

const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const message: string = "A user with this email could not be found!";
    console.log(message);
    throw new Error(message);
  }

  const match = await bcript.compare(password, user.password);
  if (!match) {
    const message: string = "Password is incorrect";
    console.log(message);
    throw new Error(message);
  }

  const token = jwt.sign(
    { userID: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  return token;
};

export { register, login };
