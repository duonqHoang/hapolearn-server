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

export { createLesson };
