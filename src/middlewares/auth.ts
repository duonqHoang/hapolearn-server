import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

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

export { isAuthenticated };
