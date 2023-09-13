import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

const findUserByID = (id: number) => userRepo.findOneBy({ id });

const findUserByUsername = (username: string) =>
  userRepo.findOneBy({ username });

const findUserByRefreshToken = (refreshToken: string) => {
  return userRepo
    .createQueryBuilder("user")
    .where("user.refreshTokens LIKE :rt", { rt: `%${refreshToken}%` })
    .getOne();
};

const findExistedUser = (username: string, email: string) => {
  return userRepo.findOneBy([{ username }, { email }]);
};

const registerUser = (username: string, email: string, password: string) => {
  const user = userRepo.create({
    username,
    email,
    password,
  });
  return userRepo.save(user);
};

const saveRefreshToken = async (user: User, refreshTokens: string[]) => {
  user.refreshTokens = refreshTokens;
  return userRepo.save(user);
};

const updateProfile = async (
  id: number,
  name: string,
  email: string,
  dob: string,
  phone: string,
  address: string,
  bio: string
) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw new Error("Error finding user profile");
  userRepo.merge(user, {
    name,
    email,
    dob,
    phone,
    address,
    bio,
  });
  return userRepo.save(user);
};

export {
  findUserByID,
  findUserByUsername,
  findUserByRefreshToken,
  findExistedUser,
  registerUser,
  updateProfile,
  saveRefreshToken,
};
