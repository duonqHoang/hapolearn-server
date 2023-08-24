import bcript from "bcrypt";
import { findUserByEmail, saveUser } from "../repositories/user";
import { User } from "../entities/User";

const register = async (
  username: string,
  email: string,
  password: string
): Promise<User | null> => {
  const existedUser = await findUserByEmail(email);
  if (existedUser) {
    console.log("Email is already used!");
    return null;
  }
  const hashed = await bcript.hash(password, 12);
  const newUser = await saveUser(username, email, hashed);
  if (newUser) {
    console.log("Registered new user!");
    return newUser;
  }
};

export { register };
