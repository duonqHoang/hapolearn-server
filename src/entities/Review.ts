import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Unique(["user", "course"])
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  star: number;

  @Column({ type: "text" })
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;
}
