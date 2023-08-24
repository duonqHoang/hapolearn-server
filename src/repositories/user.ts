import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

const findUserByEmail = (email: string) => userRepo.findOneBy({ email });

const saveUser = (name: string, email: string, password: string) => {
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  return userRepo.save(user);
};

export { findUserByEmail, saveUser };
