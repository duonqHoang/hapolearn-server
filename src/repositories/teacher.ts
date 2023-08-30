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

export { findTeacherByID, addTeacher };
