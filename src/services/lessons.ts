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
  if (!lessonNumber) {
    const data = await lessonRepo.getLessons(courseID, page, s);
    return { lessons: data[0], lessonsCount: data[1] };
  } else {
    const data = await lessonRepo.getOneLesson(courseID, lessonNumber);
    return data;
  }
};

export { createLesson, getLessons };
