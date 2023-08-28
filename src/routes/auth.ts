import express from "express";
import { login, register } from "../controllers/auth";
import { loginVal, registerVal } from "../middlewares/validation";

export default (router: express.Router) => {
  router.post("/register", registerVal, register);

  router.post("/login", loginVal, login);
};
