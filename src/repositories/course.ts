import { Course } from "../entities/Course";
import { AppDataSource } from "../data-source";
import { findTeacherByID } from "./teacher";
import { ParsedQs } from "qs";
import { Lesson } from "../entities/Lesson";
import { findUserByID, getUsersCount } from "./user";
import { Review } from "../entities/Review";
import { getLessonsCount } from "./lesson";

const courseRepo = AppDataSource.getRepository(Course);

const findCourseByID = (id: number) => courseRepo.findOneBy({ id });

const getTeacherCourses = (teacherID: number) =>
  courseRepo.findBy({ teacher: { id: teacherID } });

const getCourseByID = async (id: number) => {
  const query = courseRepo
    .createQueryBuilder("course")
    .where("course.id = :courseID", { courseID: id })
    .leftJoin("course.teacher", "teacher")
    .leftJoin("teacher.user", "user");

  query.addSelect([
    "course.*",
    "teacher",
    "user.name",
    "user.avatar",
    "user.bio",
  ]);

  query.addSelect((subQuery) => {
    return subQuery
      .select("SUM(lesson.time)", "time")
      .groupBy("lesson.courseId")
      .from(Lesson, "lesson")
      .where("lesson.courseId = course.id");
  }, "course_time");

  // get learners and lessons counts
  query.loadRelationCountAndMap("course.lessonsCount", "course.lessons");
  query.loadRelationCountAndMap("course.learnersCount", "course.learners");

  return query.getOne();
};

const addCourse = async (
  name: string,
  description: string,
  image: string,
  price: number,
  teacherID: number,
  lessons: Array<{ name: string; time: number }>
) => {
  const teacher = await findTeacherByID(teacherID);
  if (!teacher) throw new Error("Cannot find teacher");
  const newCourse = courseRepo.create({
    name,
    description,
    image,
    price,
    teacher,
  });

  lessons.forEach((lesson) => {
    const newLesson = new Lesson();
    newLesson.name = lesson.name;
    newLesson.time = lesson.time;
    newCourse.lessons = [...(newCourse.lessons || []), newLesson];
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

  query.addSelect((subQuery) => {
    return subQuery
      .select("SUM(lesson.time)", "time")
      .groupBy("lesson.courseId")
      .from(Lesson, "lesson")
      .where("lesson.courseId = course.id");
  }, "course_time");

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
    query.addOrderBy("course_time", time === "asc" ? "ASC" : "DESC");
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

const getCoursesStats = async () => {
  const coursesCount = await courseRepo.count();
  const learnersCount = await getUsersCount();
  const lessonsCount = await getLessonsCount();
  return { coursesCount, lessonsCount, learnersCount };
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
    relations: { learners: true, teacher: true },
    where: { id: courseID },
  });
  if (!course) throw new Error("Error finding course");
  const user = await findUserByID(userID);
  if (!user) throw new Error("Error finding user");
  if (course.teacher.id === user?.teacherProfile?.id)
    throw new Error("Cannot enroll in your own course");
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

const updateCourse = (
  course: Course,
  name: string,
  description: string,
  image: string,
  price: number,
  lessons: Array<{ name: string; time: number }>
) => {
  if (name) course.name = name;
  if (description) course.description = description;
  if (image) course.image = image;
  if (price) course.price = price;
  if (lessons?.length > 0) {
    course.lessons = lessons.map((item) => {
      const lesson = new Lesson();
      lesson.name = item.name;
      lesson.time = item.time;
      return lesson;
    });
  }
  return courseRepo.save(course);
};

const deleteCourse = (course: Course) => {
  return courseRepo.delete({ id: course.id });
};

export {
  findCourseByID,
  getTeacherCourses,
  getCourseByID,
  addCourse,
  getCourses,
  getCoursesStats,
  getBestCourses,
  enrollCourse,
  unenrollCourse,
  updateCourse,
  deleteCourse,
};
