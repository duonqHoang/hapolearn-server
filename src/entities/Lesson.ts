import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { Document } from "./Document";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  requirement: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @OneToMany(() => Document, (document) => document.lesson)
  documents: Document[];
}
