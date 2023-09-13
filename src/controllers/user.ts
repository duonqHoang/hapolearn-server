import { RequestHandler } from "express";
import * as userServices from "../services/user";

const getProfile: RequestHandler = async (req, res, next) => {
  const userID = req.body.userID;
  try {
    const profile = await userServices.getProfile(userID);
    res.json(profile);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  const { name, email, dob, phone, address, bio } = req.body;
  try {
    const updatedProfile = await userServices.updateProfile(
      req.body.userID,
      name,
      email,
      dob,
      phone,
      address,
      bio
    );
    if (updatedProfile) res.send("Updated user profile");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { getProfile, updateProfile };