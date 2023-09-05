import { RequestHandler } from "express";
import * as lessonServices from "../services/lessons";

const createLesson: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, requirement, courseID } = req.body;
    const newLesson = await lessonServices.createLesson(
      name,
      description,
      requirement,
      courseID
    );
    if (newLesson) {
      res.send("Created new lesson");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { createLesson };
