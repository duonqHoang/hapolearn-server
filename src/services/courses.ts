import * as courseRepo from "../repositories/course";
import { ParsedQs } from "qs";
import formidable from "formidable";
import fs from "fs";
import { findTeacherByID } from "../repositories/teacher";
import { Request } from "express";

const addCourse = async (req: Request) => {
  const form = formidable({
    uploadDir: "public/images",
    keepExtensions: true,
    maxFiles: 1,
    multiples: true,
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
    +req.body.teacherID,
    JSON.parse(fields.lessons[0])
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

const updateCourse = async (req: Request) => {
  const courseID = req.params.courseID;

  const course = await courseRepo.findCourseByID(+courseID);
  if (!course) throw new Error("Course does not exist");

  const form = formidable({
    uploadDir: "public/images",
    keepExtensions: true,
    maxFiles: 1,
    multiples: true,
  });

  const [fields, files] = await form.parse(req);

  if (files.image && files.image[0]) {
    fs.unlink(
      __dirname + "\\..\\..\\public\\images\\" + course.image,
      () => {}
    );

    fs.rename(files.image[0].filepath, files.image[0].filepath, (err) => {
      if (err) throw err;
    });
  }

  const updatedCourse = await courseRepo.updateCourse(
    course,
    fields.name[0],
    fields.description[0],
    files.image ? files.image[0].newFilename : null,
    +fields.price[0],
    +fields.time[0],
    JSON.parse(fields.lessons[0])
  );

  if (!updatedCourse) throw new Error("Error creating new course");
  return updatedCourse;
};

const deleteCourse = async (courseID: number, teacherID: number) => {
  const course = await courseRepo.findCourseByID(courseID);
  if (!course) throw new Error("Error finding course");
  const teacher = await findTeacherByID(teacherID);
  if (!teacher) throw new Error("Error finding teacher");
  const teacherCourses = await courseRepo.getTeacherCourses(teacherID);
  if (!teacherCourses.find((course) => course.id === courseID))
    throw new Error("Course belongs to another teacher");

  if (course.image) {
    fs.unlink(
      __dirname + "\\..\\..\\public\\images\\" + course.image,
      (err) => {
        if (err) throw err;
      }
    );
  }

  const deleted = await courseRepo.deleteCourse(course);
  return deleted;
};

export {
  addCourse,
  getCourses,
  getBestCourses,
  getCourseByID,
  enrollCourse,
  unenrollCourse,
  updateCourse,
  deleteCourse,
};
