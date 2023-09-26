import { Course } from "../entities/Course";
import { AppDataSource } from "../data-source";
import { findTeacherByID } from "./teacher";
import { ParsedQs } from "qs";
import { Lesson } from "../entities/Lesson";
import { findUserByID } from "./user";
import { Review } from "../entities/Review";

const courseRepo = AppDataSource.getRepository(Course);

const findCourseByID = (id: number) => courseRepo.findOneBy({ id });

const getCourseByID = async (id: number) => {
  const query = courseRepo
    .createQueryBuilder("course")
    .where("course.id = :courseID", { courseID: id })
    .leftJoin("course.teacher", "teacher");

  query.addSelect(["course.*", "teacher"]);

  // get learners and lessons counts
  query.loadRelationCountAndMap("course.lessonsCount", "course.lessons");
  query.loadRelationCountAndMap("course.learnersCount", "course.learners");

  return query.getOne();
};

const addCourse = async (
  name: string,
  description: string,
  price: number,
  time: number,
  teacherID: number
) => {
  const teacher = await findTeacherByID(teacherID);
  if (!teacher) throw new Error("Cannot find teacher");
  const newCourse = courseRepo.create({
    name,
    description,
    price,
    time,
    teacher,
  });
  return courseRepo.save(newCourse);
};

const getCourses = (queries: ParsedQs) => {
  const { page, s, date, teacher, learners, time, lessons, tag, review } =
    queries;

  const coursesPerPage: number = 14;
  const query = courseRepo.createQueryBuilder("course");

  // load lessons and learners counts
  query.loadRelationCountAndMap("course.lessonsCount", "course.lessons");
  query.loadRelationCountAndMap("course.learnersCount", "course.learners");

  // filters
  if (s) {
    query.andWhere("course.name LIKE :search", { search: `%${s}%` });
  }

  if (teacher) {
    query.andWhere("course.teacherId = :teacher", { teacher: +teacher });
  }

  // orders: order added earlier takes precedence

  if (date) {
    query.addOrderBy("course.createdAt", date === "asc" ? "ASC" : "DESC");
  }

  if (lessons) {
    query.addSelect((subQuery) => {
      return subQuery
        .select("COUNT(lesson.id)", "lessonsCount")
        .from(Lesson, "lesson")
        .where("lesson.courseId = course.id");
    }, "lessonsCount");
    query.addOrderBy("lessonsCount", lessons === "asc" ? "ASC" : "DESC");
  }

  if (learners) {
    query.addSelect((subQuery) => {
      return subQuery
        .select("COUNT(*)", "learnersCount")
        .groupBy("enrollments.courseId")
        .from("user_courses_course", "enrollments")
        .where("enrollments.courseId = course.id");
    }, "learnersCount");
    query.addOrderBy("learnersCount", learners === "asc" ? "ASC" : "DESC");
  }

  if (time) {
    query.addOrderBy("course.time", time === "asc" ? "ASC" : "DESC");
  }

  if (review) {
    query.addSelect((sb) => {
      return sb
        .select("SUM(review.star) / COUNT(review.id)", "averageRating")
        .groupBy("review.courseId")
        .from(Review, "review")
        .where("review.courseId = course.id");
    }, "averageRating");
    query.addOrderBy("averageRating", review === "asc" ? "ASC" : "DESC");
  }

  // pagination
  query.skip(coursesPerPage * (page ? +page - 1 : 0)).take(coursesPerPage);

  return query.getManyAndCount();
};

const getBestCourses = async () => {
  const query = courseRepo.createQueryBuilder("course");
  query.addSelect((sb) => {
    return sb
      .select("SUM(review.star) / COUNT(review.id)", "averageRating")
      .groupBy("review.courseId")
      .from(Review, "review")
      .where("review.courseId = course.id");
  }, "averageRating");
  query.addOrderBy("averageRating", "DESC");
  query.take(6);
  return query.getMany();
};

const enrollCourse = async (courseID: number, userID: number) => {
  const course = await courseRepo.findOne({
    relations: { learners: true },
    where: { id: courseID },
  });
  if (!course) throw new Error("Error finding course");
  const user = await findUserByID(userID);
  if (!user) throw new Error("Error finding user");

  if (
    course.learners.find((learner) => {
      return learner.id === user.id;
    })
  )
    throw new Error("Already enrolled course");

  course.learners.push(user);

  return courseRepo.save(course);
};

const unenrollCourse = async (courseID: number, userID: number) => {
  const course = await courseRepo.findOne({
    relations: { learners: true },
    where: { id: courseID },
  });
  if (!course) throw new Error("Error finding course!");

  course.learners = course.learners.filter((learner) => {
    return learner.id !== userID;
  });

  return courseRepo.save(course);
};

export {
  findCourseByID,
  getCourseByID,
  addCourse,
  getCourses,
  getBestCourses,
  enrollCourse,
  unenrollCourse,
};
