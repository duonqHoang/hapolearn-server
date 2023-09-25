import * as teachersController from "../controllers/teachers";
import express from "express";

export default (router: express.Router) => {
  router.get("/teachers", teachersController.getTeachers);

  router.post("/teachers", teachersController.addTeacher);
};
