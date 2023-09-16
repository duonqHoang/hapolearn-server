import express from "express";
import * as authController from "../controllers/auth";
import { loginVal, registerVal } from "../middlewares/validation";
import { isAuthenticated } from "../middlewares/auth";

export default (router: express.Router) => {
  router.post("/register", registerVal, authController.register);

  router.post("/login", loginVal, authController.login);

  router.get("/login", authController.getLoginStatus);

  router.get("/refresh", authController.handleRefreshToken);

  router.post("/logout", isAuthenticated, authController.logout);
};
