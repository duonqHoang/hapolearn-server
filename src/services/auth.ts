import bcript from "bcrypt";
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

export { register };
