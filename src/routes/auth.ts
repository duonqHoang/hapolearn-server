import express from "express";
import * as authController from "../controllers/auth";
import {
  forgetPassVal,
  loginVal,
  registerVal,
  resetPassVal,
} from "../middlewares/validation";
import { isAuthenticated } from "../middlewares/auth";

export default (router: express.Router) => {
  router.post("/register", registerVal, authController.register);

  router.post("/login", loginVal, authController.login);

  router.get("/login", authController.getLoginStatus);

  router.get("/refresh", authController.handleRefreshToken);

  router.post("/logout", isAuthenticated, authController.logout);

  router.post("/forget-password", forgetPassVal, authController.forgetPassword);

  router.get(
    "/reset-password/:username/:token",
    authController.getResetPassword
  );

  router.post("/reset-password", resetPassVal, authController.resetPassword);
};
