import { RequestHandler } from "express";
import * as lessonServices from "../services/lessons";

const createLesson: RequestHandler = async (req, res, next) => {
  try {
    const { courseID } = req.params;
    const { name, description, requirement } = req.body;
    const newLesson = await lessonServices.createLesson(
      name,
      description,
      requirement,
      +courseID
    );
    if (newLesson) {
      res.send("Created new lesson");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getLessons: RequestHandler = async (req, res, next) => {
  try {
    const { courseID } = req.params;
    const data = await lessonServices.getLessons(+courseID);
    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { createLesson, getLessons };
