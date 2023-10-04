import { Lesson } from "../entities/Lesson";
import { AppDataSource } from "../data-source";
import { findCourseByID } from "./course";
import { Like } from "typeorm";

const lessonRepo = AppDataSource.getRepository(Lesson);

const getLessons = async (courseID: number, page: number, s: string) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  const lessonsPerPage = 20;

  return lessonRepo.findAndCount({
    relations: { course: true },
    select: { course: {} },
    where: { course: { id: courseID }, name: Like(`%${s || ""}%`) },
    skip: lessonsPerPage * (page ? page - 1 : 0),
    take: lessonsPerPage,
  });
};

const getLessonsCount = () => lessonRepo.count();

const getOneLesson = async (courseID: number, lessonNumber: number) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  return lessonRepo.findOneBy({
    id: lessonNumber,
    course: { id: courseID },
  });
};

const createLesson = async (
  courseID: number,
  name: string,
  time: number,
  description?: string,
  requirement?: string
) => {
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Cannot find course");
  const newLesson = lessonRepo.create({
    time,
    name,
    description,
    requirement,
    course,
  });

  return lessonRepo.save(newLesson);
};

export { createLesson, getLessons, getLessonsCount, getOneLesson };
