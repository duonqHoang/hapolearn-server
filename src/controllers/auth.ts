import { RequestHandler } from "express";
import * as authService from "../services/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.register(username, email, password);
    if (newUser) res.send("Registered new user!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { register };
