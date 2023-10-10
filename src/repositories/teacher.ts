import { AppDataSource } from "../data-source";
import { Teacher } from "../entities/Teacher";
import { findUserByID } from "./user";

const teacherRepo = AppDataSource.getRepository(Teacher);

const findTeacherByID = (id: number) => teacherRepo.findOneBy({ id });

const addTeacher = async (userID: number, role: string) => {
  const user = await findUserByID(userID);
  if (!user.name) throw new Error("Please update your profile name first");
  if (!user) throw new Error("User does not exist");
  const newTeacher = teacherRepo.create({
    role,
    user,
  });
  return teacherRepo.save(newTeacher);
};

const getTeachers = () => {
  return teacherRepo.find({
    relations: { user: true },
    select: { id: true, user: { name: true } },
  });
};

export { findTeacherByID, addTeacher, getTeachers };
