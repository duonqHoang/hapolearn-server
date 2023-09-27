import { RequestHandler } from "express";
import * as teacherServices from "../services/teachers";

const addTeacher: RequestHandler = async (req, res, next) => {
  const { userID, role } = req.body;
  try {
    const newTeacher = await teacherServices.addTeacher(userID, role);
    if (newTeacher) res.send("Created new teacher");
  } catch (err) {
    res.status(400).send("Error creating new teacher");
  }
};

const getTeachers: RequestHandler = async (req, res, next) => {
  try {
    const teachers = await teacherServices.getTeachers();
    res.json(teachers);
  } catch (err) {
    res.status(400).send("Error creating new teacher");
  }
};

export { addTeacher, getTeachers };
