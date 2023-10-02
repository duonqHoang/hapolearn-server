import { RequestHandler } from "express";
import * as courseService from "../services/courses";

const addCourse: RequestHandler = async (req, res, next) => {
  try {
    const newCourse = await courseService.addCourse(req);
    if (newCourse) res.json(newCourse);
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

const getBestCourses: RequestHandler = async (req, res, next) => {
  try {
    const courses = await courseService.getBestCourses();
    res.json(courses);
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

const deleteCourse: RequestHandler = async (req, res, next) => {
  const courseID = req.params.courseID;
  const { teacherID } = req.body;
  try {
    await courseService.deleteCourse(+courseID, +teacherID);
    res.send("Deleted course");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export {
  addCourse,
  getCourses,
  getBestCourses,
  getCourseByID,
  enrollCourse,
  unenrollCourse,
  deleteCourse,
};
