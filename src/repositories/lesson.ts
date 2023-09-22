import { Lesson } from "../entities/Lesson";
import { AppDataSource } from "../data-source";
import { findCourseByID } from "./course";

const lessonRepo = AppDataSource.getRepository(Lesson);

const getLessons = async (courseID: number) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  return lessonRepo.findAndCount({
    relations: { course: true },
    select: { course: {} },
    where: { course: { id: courseID } },
  });
};

const getOneLesson = async (courseID: number, lessonNumber: number) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  return lessonRepo.findAndCount({
    relations: { course: true },
    skip: lessonNumber - 1,
    take: 1,
    where: { course: { id: courseID } },
  });
};

const createLesson = async (
  name: string,
  description: string,
  requirement: string,
  courseID: number
) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  const newLesson = lessonRepo.create({
    name,
    description,
    requirement,
    course,
  });

  return lessonRepo.save(newLesson);
};

export { createLesson, getLessons, getOneLesson };
