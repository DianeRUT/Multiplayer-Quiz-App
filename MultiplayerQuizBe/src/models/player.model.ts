// src/models/Player.model.ts
import { Table, Column, Model, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { GameSession } from './game.model';
import { User } from './user.model';

@Table({ timestamps: true })
export class Player extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  nickname!: string;

  @Column({ defaultValue: 0 })
  score!: number;

  @ForeignKey(() => GameSession)
  @Column
  gameSessionId!: number;

  @BelongsTo(() => GameSession)
  gameSession!: GameSession;

  // Add user relationship for authenticated players
  @ForeignKey(() => User)
  @Column
  userId?: number;

  @BelongsTo(() => User)
  user?: User;

  // Add battle-related fields
  @Column({ defaultValue: 0 })
  questionsAnswered!: number;

  @Column({ defaultValue: 0 })
  correctAnswers!: number;

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  averageResponseTime!: number;

  @Column({ defaultValue: false })
  isReady!: boolean;

  @Column
  joinedAt?: Date;

  @Column
  leftAt?: Date;

  @Column({ type: DataType.JSON })
  answers?: {
    questionId: number;
    answer: string;
    isCorrect: boolean;
    responseTime: number;
    answeredAt: Date;
  }[];
}