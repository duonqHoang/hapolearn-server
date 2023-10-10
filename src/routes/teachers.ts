import { isAuthenticated } from "../middlewares/auth";
import * as teachersController from "../controllers/teachers";
import { Router } from "express";

export default (router: Router) => {
  router.get("/teachers", teachersController.getTeachers);

  router.post("/teachers", isAuthenticated, teachersController.addTeacher);
};
