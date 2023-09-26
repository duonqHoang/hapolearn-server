import * as lessonController from "../controllers/lessons";
import { Router } from "express";

export default (router: Router) => {
  router.get("/lessons", lessonController.getLessons);

  router.post("/lessons/:courseID", lessonController.createLesson);
};
