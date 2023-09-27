import * as courseRepo from "../repositories/course";
import { ParsedQs } from "qs";
import formidable from "formidable";
import fs from "fs";

const addCourse = async (req: any) => {
  const form = formidable({
    uploadDir: "public/images",
    keepExtensions: true,
    maxFiles: 1,
  });
  const [fields, files] = await form.parse(req);

  fs.rename(files.image[0].filepath, files.image[0].filepath, (err) => {
    if (err) throw err;
  });

  const newCourse = await courseRepo.addCourse(
    fields.name[0],
    fields.description[0],
    files.image[0].newFilename,
    +fields.price[0],
    +fields.time[0],
    +fields.teacherID[0]
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
