import { RequestHandler } from "express";
import * as lessonServices from "../services/lessons";

const createLesson: RequestHandler = async (req, res, next) => {
  try {
    const { courseID } = req.params;
    const { name, time, description, requirement } = req.body;
    const newLesson = await lessonServices.createLesson(
      +courseID,
      name,
      +time,
      description,
      requirement
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
    const { courseID, page, s, lessonNumber } = req.query;
    const data = await lessonServices.getLessons(
      +courseID,
      +page,
      s as string,
      +lessonNumber
    );
    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { createLesson, getLessons };
