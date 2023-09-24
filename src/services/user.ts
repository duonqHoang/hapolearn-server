import * as userRepo from "../repositories/user";

const getProfile = async (userID: number) => {
  const user = await userRepo.findUserByID(userID);
  if (!user) throw new Error("Error getting user profile");
  delete user.password;
  delete user.refreshTokens;
  return user;
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
  const updated = await userRepo.updateProfile(
    id,
    name,
    email,
    dob,
    phone,
    address,
    bio
  );
  if (!updated) throw new Error("Error updating user profile");
  return updated;
};

const getEnrolledCourses = async (userID: number) => {
  const user = await userRepo.findUserByID(userID);
  if (!user) throw new Error("Error finding user");
  return user.courses;
};

export { getProfile, updateProfile, getEnrolledCourses };
