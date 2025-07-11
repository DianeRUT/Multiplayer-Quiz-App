// src/models/Quiz.model.ts
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
  DataType,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Question } from "./question.model";
import { Category } from "./category.model";

export enum QuizStatus {
  PRIVATE = 'PRIVATE', // Default, only owner can see and use
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Owner requested it to be public
  PUBLIC = 'PUBLIC', // Admin approved, visible to all creators
}

@Table({ timestamps: true })
export class Quiz extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  title!: string;

    @Column({
    type: DataType.ENUM(...Object.values(QuizStatus)),
    defaultValue: QuizStatus.PRIVATE,
  })
  status!: QuizStatus;

  @ForeignKey(() => User)
  @Column
  creatorId!: number;

  @ForeignKey(() => Category)
  @Column
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @BelongsTo(() => User)
  creator!: User;

  @HasMany(() => Question)
  questions!: Question[];
}
