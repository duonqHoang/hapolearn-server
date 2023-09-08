import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Review } from "./Review";
import { Lesson } from "./Lesson";
import { Teacher } from "./Teacher";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "double" })
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => User, (user) => user.courses)
  learners: User[];

  @OneToMany(() => Review, (review) => review.course, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
  lessons: Lesson[];

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, { cascade: true })
  teacher: Teacher;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
