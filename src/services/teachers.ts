import * as teacherRepo from "../repositories/teacher";

const addTeacher = async (userID: number, role: string) => {
  const newTeacher = await teacherRepo.addTeacher(userID, role);
  if (!newTeacher) throw new Error("Cannot create teacher!");
  return newTeacher;
};

const getTeachers = async () => {
  const teachers = await teacherRepo.getTeachers();
  if (!teachers) throw new Error("Error getting teachers");
  return teachers;
};

export { addTeacher, getTeachers };
