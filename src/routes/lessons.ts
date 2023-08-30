import * as lessonController from "../controllers/lessons";
import express from "express";

export default (router: express.Router) => {
  router.post("/lessons", lessonController.createLesson);
};
