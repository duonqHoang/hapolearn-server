import { RequestHandler } from "express";
import * as courseService from "../services/courses";

const addCourse: RequestHandler = async (req, res, next) => {
  const { name, description, price, time, teacherID } = req.body;
  try {
    const newCourse = await courseService.addCourse(
      name,
      description,
      price,
      time,
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
    const [courses, coursesCount] = await courseService.getCourses(queries);
    if (courses) res.json([courses, coursesCount]);
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

const enrollCourse: RequestHandler = async (req, res, next) => {
  const courseID = req.params.courseID;
  try {
    const saved = await courseService.enrollCourse(+courseID, +req.body.userID);
    if (saved) res.send("Enrolled course successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const unenrollCourse: RequestHandler = async (req, res, next) => {
  const courseID = req.params.courseID;
  try {
    const saved = await courseService.unenrollCourse(
      +courseID,
      +req.body.userID
    );
    if (saved) res.send("Unenrolled course successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { addCourse, getCourses, getCourseByID, enrollCourse, unenrollCourse };
