import { AppDataSource } from "../data-source";
import { Teacher } from "../entities/Teacher";

const teacherRepo = AppDataSource.getRepository(Teacher);

const findTeacherByID = (id: number) => teacherRepo.findOneBy({ id });

const addTeacher = (name: string, role: string, bio?: string) => {
  const newTeacher = teacherRepo.create({
    name,
    role,
    bio,
  });
  return teacherRepo.save(newTeacher);
};

const getTeachers = () => {
  return teacherRepo.find({ select: { id: true, name: true } });
};

export { findTeacherByID, addTeacher, getTeachers };
