import { Course } from "../entities/Course";
import { AppDataSource } from "../data-source";
import { findTeacherByID } from "./teacher";

const courseRepo = AppDataSource.getRepository(Course);

const findCourseByID = (id: number) => courseRepo.findOneBy({ id });

const addCourse = async (
  name: string,
  description: string,
  price: number,
  teacherID: number
) => {
  const teacher = await findTeacherByID(teacherID);
  if (!teacher) throw new Error("Cannot find teacher");
  const newCourse = courseRepo.create({
    name,
    description,
    price,
    teacher,
  });
  return courseRepo.save(newCourse);
};

const getAllCourses = () => {
  return courseRepo.find({
    relations: {
      lessons: true,
      learners: true,
    },
  });
};

const getCoursesByPage = (pageNumber: number) => {
  return courseRepo.find({
    relations: {
      lessons: true,
      learners: true,
    },
    skip: 14 * (pageNumber - 1),
    take: 14,
  });
};

export { findCourseByID, addCourse, getAllCourses, getCoursesByPage };
