import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByID } from "../repositories/user";

interface UserJWTPayload extends JwtPayload {
  userID: number;
}

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const decodedToken = <UserJWTPayload>(
      jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
    );
    const userID = decodedToken.userID;
    const user = await findUserByID(userID);
    if (user) {
      if (req.url === "/login") {
        res.send("Already logged in");
      }
      req.body.userID = userID;
      next();
    } else throw new Error("User not found");
  } catch (err) {
    res.status(401).send(err.message);
  }
};

export { isAuthenticated };
