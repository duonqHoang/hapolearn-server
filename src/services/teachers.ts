import { Teacher } from "entities/Teacher";
import * as teacherRepo from "../repositories/teacher";

const addTeacher = async (name: string, role: string, bio?: string) => {
  const newTeacher = await teacherRepo.addTeacher(name, role, bio);
  if (!newTeacher) throw new Error("Cannot create teacher!");
  return newTeacher;
};

const getTeachers = async () => {
  const teachers = await teacherRepo.getTeachers();
  if (!teachers) throw new Error("Error getting teachers");
  return teachers;
};

export { addTeacher, getTeachers };
