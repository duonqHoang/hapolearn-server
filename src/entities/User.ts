import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { Review } from "./Review";
import { Teacher } from "./Teacher";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
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
  dob: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: "simple-array", nullable: true })
  refreshTokens: string[];

  @ManyToMany(() => Course, (course) => course.learners, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  @JoinColumn()
  teacherProfile: Teacher;
}
