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
import { Quiz } from "./quiz.model";
import { Tournament } from "./tournament.model";

export enum BattleStatus {
  SCHEDULED = "SCHEDULED",
  WAITING = "WAITING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

export enum BattleType {
  TOURNAMENT = "TOURNAMENT",
  FRIENDLY = "FRIENDLY",
  RANKED = "RANKED",
  CUSTOM = "CUSTOM",
}

@Table({ timestamps: true })
export class Battle extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(BattleStatus)),
    defaultValue: BattleStatus.SCHEDULED,
  })
  status!: BattleStatus;

  @Column({
    type: DataType.ENUM(...Object.values(BattleType)),
    defaultValue: BattleType.FRIENDLY,
  })
  type!: BattleType;

  @ForeignKey(() => Quiz)
  @Column
  quizId!: number;

  @BelongsTo(() => Quiz)
  quiz!: Quiz;

  @ForeignKey(() => Tournament)
  @Column
  tournamentId?: number;

  @BelongsTo(() => Tournament)
  tournament?: Tournament;

  @Column({ type: DataType.INTEGER })
  round?: number; // For tournament battles

  @Column({ type: DataType.INTEGER })
  matchNumber?: number; // For tournament battles

  @Column
  scheduledAt?: Date;

  @Column
  startedAt?: Date;

  @Column
  finishedAt?: Date;

  @Column({ type: DataType.JSON })
  settings?: {
    timeLimit?: number; // seconds per question
    questionsCount?: number;
    allowSpectators?: boolean;
    autoStart?: boolean;
  };

  @Column({ type: DataType.JSON })
  results?: {
    winnerId?: number;
    loserId?: number;
    isDraw?: boolean;
    winnerScore?: number;
    loserScore?: number;
    questionsAnswered?: {
      player1: number;
      player2: number;
    };
    averageResponseTime?: {
      player1: number;
      player2: number;
    };
  };

  @HasMany(() => BattleParticipant)
  participants!: BattleParticipant[];

  @HasMany(() => BattleQuestion)
  questions!: BattleQuestion[];
}

@Table({ timestamps: true })
export class BattleParticipant extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Battle)
  @Column
  battleId!: number;

  @BelongsTo(() => Battle)
  battle!: Battle;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ defaultValue: 0 })
  score!: number;

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

@Table({ timestamps: true })
export class BattleQuestion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Battle)
  @Column
  battleId!: number;

  @BelongsTo(() => Battle)
  battle!: Battle;

  @Column
  questionText!: string;

  @Column({ type: DataType.JSON })
  options!: {
    text: string;
    isCorrect: boolean;
  }[];

  @Column
  correctAnswer!: string;

  @Column({ type: DataType.INTEGER })
  order!: number;

  @Column
  timeLimit?: number;

  @Column
  askedAt?: Date;

  @Column
  answeredAt?: Date;

  @Column({ type: DataType.JSON })
  playerAnswers?: {
    playerId: number;
    answer: string;
    isCorrect: boolean;
    responseTime: number;
    answeredAt: Date;
  }[];
} 