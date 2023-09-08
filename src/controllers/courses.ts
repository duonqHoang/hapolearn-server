import { RequestHandler } from "express";
import * as courseService from "../services/courses";

const addCourse: RequestHandler = async (req, res, next) => {
  const { name, description, price, teacherID } = req.body;
  try {
    const newCourse = await courseService.addCourse(
      name,
      description,
      price,
      teacherID
    );
    if (newCourse) res.send("Created new course");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getCourses: RequestHandler = async (req, res, next) => {
  try {
    const queries = req.query;
    const courses = await courseService.getCourses(queries);
    if (courses) res.json(courses);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getCourseByID: RequestHandler = async (req, res, next) => {
  try {
    const id = +req.params.courseID;
    const course = await courseService.getCourseByID(id);
    if (course) res.json(course);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { addCourse, getCourses, getCourseByID };
