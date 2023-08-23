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
import { IsEmail, IsISO8601, MinLength } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @MinLength(8)
  password: string;

  @Column({ type: "text" })
  bio: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: "date" })
  @IsISO8601()
  dob: string;

  @Column()
  avatar: string;

  @ManyToMany(() => Course, (course) => course.learners, { cascade: true })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
