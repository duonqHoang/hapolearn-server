import * as courseController from "../controllers/courses";
import express from "express";

export default (router: express.Router) => {
  router.post("/courses", courseController.addCourse);

  router.get("/courses", courseController.getCourses);

  router.get("/courses/:courseID", courseController.getCourseByID);
};
