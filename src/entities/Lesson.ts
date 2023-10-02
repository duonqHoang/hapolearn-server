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

  @Column()
  time: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  requirement: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @OneToMany(() => Document, (document) => document.lesson)
  documents: Document[];

  @Column({ type: "simple-array", nullable: true })
  tags: string[];
}
