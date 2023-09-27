import * as userRepo from "../repositories/user";
import formidable from "formidable";
import fs from "fs";

const getProfile = async (userID: number) => {
  const user = await userRepo.getProfileByID(userID);
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

const changeAvatar = async (req: any) => {
  const { userID } = req.body;
  const user = await userRepo.findUserByID(+userID);
  if (!user) throw new Error("User not found");

  const form = formidable({
    uploadDir: "public/images",
    keepExtensions: true,
    maxFiles: 1,
    maxFields: 0,
  });

  const [_, files] = await form.parse(req);
  fs.rename(files.avatar[0].filepath, files.avatar[0].filepath, (err) => {
    if (err) throw err;
  });

  if (user.avatar) {
    fs.unlink(__dirname + "\\..\\..\\public\\images\\" + user.avatar, (err) => {
      if (err) throw err;
    });
  }

  const saved = await userRepo.changeAvatar(user, files.avatar[0].newFilename);
  return saved;
};

const getEnrolledCourses = async (userID: number) => {
  const user = await userRepo.findUserByID(userID);
  if (!user) throw new Error("Error finding user");
  return user.courses;
};

export { getProfile, updateProfile, changeAvatar, getEnrolledCourses };
