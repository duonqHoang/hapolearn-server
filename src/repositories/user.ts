import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

const findUserByID = (id: number) =>
  userRepo.findOne({
    relations: { courses: true, teacherProfile: true },
    where: { id },
  });

const getProfileByID = (id: number) =>
  userRepo.findOne({
    relations: { courses: true, teacherProfile: { courses: true } },
    where: { id },
  });

const findUserByUsername = (username: string) =>
  userRepo.findOneBy({ username });

const findUserByEmail = (email: string) => userRepo.findOneBy({ email });

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

const changePassword = async (user: User, password: string) => {
  user.password = password;
  return userRepo.save(user);
};

const updateProfile = async (
  id: number,
  name: string,
  email: string,
  dob: string,
  phone: string,
  address: string,
  bio: string,
  role: string
) => {
  const user = await userRepo.findOne({
    relations: { teacherProfile: true },
    where: { id },
  });
  if (!user) throw new Error("Error finding user profile");
  if (name) user.name = name;
  if (email) user.email = email;
  if (dob) user.dob = dob;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (bio) user.bio = bio;
  if (role && user.teacherProfile) {
    user.teacherProfile.role = role;
  }
  return userRepo.save(user);
};

const changeAvatar = (user: User, imgName: string) => {
  user.avatar = imgName;
  return userRepo.save(user);
};

export {
  findUserByID,
  getProfileByID,
  findUserByUsername,
  findUserByEmail,
  findUserByRefreshToken,
  findExistedUser,
  registerUser,
  updateProfile,
  saveRefreshToken,
  changePassword,
  changeAvatar,
};
