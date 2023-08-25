import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

const findUserByEmail = (email: string) => userRepo.findOneBy({ email });

const registerUser = (name: string, email: string, password: string) => {
  const user = userRepo.create({
    name,
    email,
    password,
  });
  return userRepo.save(user);
};

export { findUserByEmail, registerUser };
