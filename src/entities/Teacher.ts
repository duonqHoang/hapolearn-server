import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  avatar: string;

  @Column()
  role: string;

  @Column({ type: "text" })
  bio: string;

  @Column({ type: "json" })
  links: { google: ""; facebook: ""; slack: "" };

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];
}
