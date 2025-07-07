// src/models/Tournament.model.ts
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

export enum TournamentStatus {
  UPCOMING = "UPCOMING",
  REGISTRATION = "REGISTRATION",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

export enum TournamentType {
  SINGLE_ELIMINATION = "SINGLE_ELIMINATION",
  DOUBLE_ELIMINATION = "DOUBLE_ELIMINATION",
  ROUND_ROBIN = "ROUND_ROBIN",
  SWISS_SYSTEM = "SWISS_SYSTEM",
}

@Table({ timestamps: true })
export class Tournament extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TournamentStatus)),
    defaultValue: TournamentStatus.UPCOMING,
  })
  status!: TournamentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TournamentType)),
    defaultValue: TournamentType.SINGLE_ELIMINATION,
  })
  type!: TournamentType;

  @Column
  maxParticipants!: number;

  @Column({ defaultValue: 0 })
  currentParticipants!: number;

  @Column
  startDate!: Date;

  @Column
  endDate?: Date;

  @ForeignKey(() => Quiz)
  @Column
  quizId!: number;

  @BelongsTo(() => Quiz)
  quiz!: Quiz;

  @ForeignKey(() => User)
  @Column
  creatorId!: number;

  @BelongsTo(() => User)
  creator!: User;

  @Column({ defaultValue: false })
  isPublic!: boolean;

  @Column({ type: DataType.JSON })
  settings?: {
    timeLimit?: number; // seconds per question
    questionsPerBattle?: number;
    allowSpectators?: boolean;
    autoStart?: boolean;
  };

  @HasMany(() => TournamentParticipant)
  participants!: TournamentParticipant[];
}

@Table({ timestamps: true })
export class TournamentParticipant extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Tournament)
  @Column
  tournamentId!: number;

  @BelongsTo(() => Tournament)
  tournament!: Tournament;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ defaultValue: 0 })
  score!: number;

  @Column({ defaultValue: 0 })
  wins!: number;

  @Column({ defaultValue: 0 })
  losses!: number;

  @Column({ defaultValue: 0 })
  draws!: number;

  @Column({ defaultValue: false })
  isEliminated!: boolean;

  @Column
  eliminatedAt?: Date;

  @Column({ type: DataType.INTEGER })
  finalRank?: number;
} 