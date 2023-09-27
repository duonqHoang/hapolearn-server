import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { findUserByID } from "../repositories/user";

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const decodedToken: any = jwt.verify(
      req.cookies.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const userID = decodedToken.userID;
    req.body.userID = userID;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};

const isTeacher: RequestHandler = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const user = await findUserByID(userID);
    if (user.teacherProfile) {
      req.body.teacherID = user.teacherProfile.id;
      next();
    } else res.status(403).send("Not authorized");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { isAuthenticated, isTeacher };
