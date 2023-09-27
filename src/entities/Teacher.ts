import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column({ type: "json", nullable: true })
  links: { google: string; facebook: string; slack: string };

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToOne(() => User, (user) => user.teacherProfile)
  user: User;
}
