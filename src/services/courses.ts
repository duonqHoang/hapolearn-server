import { Course } from "entities/Course";
import * as courseRepo from "../repositories/course";
import { ParsedQs } from "qs";

const addCourse = async (
  name: string,
  description: string,
  price: number,
  teacherID: number
) => {
  const newCourse = await courseRepo.addCourse(
    name,
    description,
    price,
    teacherID
  );
  if (!newCourse) throw new Error("Error creating new course");
  return newCourse;
};

const getCourses = async (queries?: ParsedQs) => {
  let courses: Course[];

  if (true) {
    courses = await courseRepo.getCourses(queries);
    if (!courses) throw new Error("Error getting courses");
  } else {
    courses = await courseRepo.getAllCourses();
    if (!courses) throw new Error("Error getting all courses");
  }
  return courses;
};

const getCourseByID = async (id: number) => {
  const course = await courseRepo.findCourseByID(id);
  if (!course) throw new Error("Error getting course by ID");
  return course;
};

export { addCourse, getCourses, getCourseByID };
