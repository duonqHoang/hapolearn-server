import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserJWTPayload extends JwtPayload {
  userID: number;
}

const isAuthenticated: RequestHandler = (req, res, next) => {
  try {
    const decodedToken = <UserJWTPayload>(
      jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
    );
    const userID = decodedToken.userID;
    if (!userID) throw new Error("User not found");
    req.body.userID = userID;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { isAuthenticated };
