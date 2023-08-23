import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Review } from "./Review";
import { Lesson } from "./Lesson";
import { Teacher } from "./Teacher";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "double" })
  price: number;

  @Column()
  image: string;

  @ManyToMany(() => User, (user) => user.courses)
  learners: User[];

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  teacher: Teacher;
}
