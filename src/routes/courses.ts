import { isAuthenticated } from "../middlewares/auth";
import * as courseController from "../controllers/courses";
import {Router} from "express";

export default (router: Router) => {
  router.post("/courses", courseController.addCourse);

  router.get("/courses", courseController.getCourses);

  router.get("/courses/:courseID", courseController.getCourseByID);

  router.post(
    "/courses/:courseID/enroll",
    isAuthenticated,
    courseController.enrollCourse
  );

  router.post(
    "/courses/:courseID/unenroll",
    isAuthenticated,
    courseController.unenrollCourse
  );
};
