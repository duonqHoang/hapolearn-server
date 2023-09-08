import { isAuthenticated } from "../middlewares/auth";
import * as userController from "../controllers/user";
import { Router } from "express";

export default (router: Router) => {
  router.get("/user", isAuthenticated, userController.getProfile);

  router.put("/user", isAuthenticated, userController.updateProfile);
};
