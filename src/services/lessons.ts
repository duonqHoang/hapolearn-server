import * as lessonRepo from "../repositories/lesson";

const createLesson = async (
  name: string,
  description: string,
  requirement: string,
  courseID: number
) => {
  const newLesson = await lessonRepo.createLesson(
    name,
    description,
    requirement,
    courseID
  );
  if (!newLesson) throw new Error("Error creating new lesson");
  return newLesson;
};

const getLessons = async (
  courseID: number,
  page: number,
  s: string,
  lessonNumber: number
) => {
  let data;
  if (!lessonNumber) data = await lessonRepo.getLessons(courseID, page, s);
  else data = await lessonRepo.getOneLesson(courseID, lessonNumber);
  if (!data) throw new Error("Error getting lessons");
  return { lessons: data[0], lessonsCount: data[1] };
};

export { createLesson, getLessons };
