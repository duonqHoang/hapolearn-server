import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./Lesson";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.documents)
  lesson: Lesson;
}
