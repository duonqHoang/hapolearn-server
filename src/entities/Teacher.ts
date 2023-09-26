import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  role: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "json", nullable: true })
  links: { google: string; facebook: string; slack: string };

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];
}
