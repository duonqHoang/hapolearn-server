import { isAuthenticated, isTeacher } from "../middlewares/auth";
import * as courseController from "../controllers/courses";
import { Router } from "express";

export default (router: Router) => {
  router.post(
    "/courses",
    isAuthenticated,
    isTeacher,
    courseController.addCourse
  );

  router.get("/courses", courseController.getCourses);

  router.get("/courses-stats", courseController.getCoursesStats);

  router.get("/best-courses", courseController.getBestCourses);

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

  router.put(
    "/courses/:courseID",
    isAuthenticated,
    isTeacher,
    courseController.updateCourse
  );

  router.delete(
    "/courses/:courseID",
    isAuthenticated,
    isTeacher,
    courseController.deleteCourse
  );
};
