import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { Review } from "./Review";
import { IsEmail, IsISO8601 } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: "date", nullable: true })
  @IsISO8601()
  dob: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Course, (course) => course.learners, { cascade: true })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
