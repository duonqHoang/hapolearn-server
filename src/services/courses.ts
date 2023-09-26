import { Course } from "entities/Course";
import * as courseRepo from "../repositories/course";
import { ParsedQs } from "qs";

const addCourse = async (
  name: string,
  description: string,
  price: number,
  time: number,
  teacherID: number
) => {
  const newCourse = await courseRepo.addCourse(
    name,
    description,
    price,
    time,
    teacherID
  );
  if (!newCourse) throw new Error("Error creating new course");
  return newCourse;
};

const getCourses = async (queries?: ParsedQs) => {
  const [courses, coursesCount] = await courseRepo.getCourses(queries);
  if (!courses) throw new Error("Error getting courses");

  return [courses, coursesCount];
};

const getBestCourses = async () => {
  const courses = await courseRepo.getBestCourses();
  if (!courses) throw new Error("Error getting best courses");
  return courses;
};

const getCourseByID = async (id: number) => {
  const course = await courseRepo.getCourseByID(id);
  if (!course) throw new Error("Error getting course by ID");
  return course;
};

const enrollCourse = async (courseID: number, userID: number) => {
  const savedCourse = await courseRepo.enrollCourse(courseID, userID);
  if (!savedCourse) throw new Error("Error enrolling course");
  return savedCourse;
};

const unenrollCourse = async (courseID: number, userID: number) => {
  const savedCourse = await courseRepo.unenrollCourse(courseID, userID);
  if (!savedCourse) throw new Error("Error enrolling course");
  return savedCourse;
};

export {
  addCourse,
  getCourses,
  getBestCourses,
  getCourseByID,
  enrollCourse,
  unenrollCourse,
};
