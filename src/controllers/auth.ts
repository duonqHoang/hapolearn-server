import { RequestHandler } from "express";
import * as authService from "../services/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await authService.register(name, email, password.trim());
    if (newUser) res.send("Registered new user!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password.trim());

    res.cookie("jwt", token, { httpOnly: true }).send("Logged in");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { register, login };
