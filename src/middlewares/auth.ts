import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByID } from "../repositories/user";

interface UserJWTPayload extends JwtPayload {
  userID: number;
}

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const decodedToken = <UserJWTPayload>(
      jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
    );
    const userID = decodedToken.userID;
    const user = await findUserByID(userID);
    if (user) {
      req.body.userID = userID;
      next();
    } else throw new Error("User not found");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { isAuthenticated };
