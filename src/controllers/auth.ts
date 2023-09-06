import { RequestHandler } from "express";
import * as authService from "../services/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.register(
      username,
      email,
      password.trim()
    );
    if (newUser) res.send("Registered new user!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password.trim());

    res.cookie("jwt", token, { httpOnly: true }).send("Logged in");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const logout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("jwt").status(200).send("Logged out");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { register, login, logout };
