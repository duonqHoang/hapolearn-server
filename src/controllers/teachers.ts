import { RequestHandler } from "express";
import * as teacherServices from "../services/teachers";

const addTeacher: RequestHandler = async (req, res, next) => {
  const { name, role, bio } = req.body;
  try {
    const newTeacher = await teacherServices.addTeacher(name, role, bio);
    if (newTeacher) res.send("Created new teacher");
  } catch (err) {
    res.status(400).send("Error creating new teacher");
  }
};

export { addTeacher };
