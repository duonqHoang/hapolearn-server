import * as lessonRepo from "../repositories/lesson";

const createLesson = async (
  courseID: number,
  name: string,
  time: number,
  description?: string,
  requirement?: string
) => {
  const newLesson = await lessonRepo.createLesson(
    courseID,
    name,
    time,
    description,
    requirement
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
