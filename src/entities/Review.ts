import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course";
import { Min, Max } from "class-validator";

@Unique(["user", "course"])
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Min(1)
  @Max(5)
  star: number;

  @Column({ type: "text" })
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;
}
