import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Course } from "./Course";
import { Review } from "./Review";

@Entity()
@Unique(["username", "email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column()
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

  @ManyToMany(() => Course, (course) => course.learners, { cascade: true })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
