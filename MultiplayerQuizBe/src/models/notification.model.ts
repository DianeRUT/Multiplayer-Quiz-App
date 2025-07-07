import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './user.model'

export interface NotificationAttributes {
  id?: number
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  category: 'user' | 'game' | 'tournament' | 'system' | 'security'
  read: boolean
  userId?: number
  actionUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

@Table({
  tableName: 'notifications',
  timestamps: true,
})
export class Notification extends Model<NotificationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string

  @Column({
    type: DataType.ENUM('info', 'warning', 'error', 'success'),
    allowNull: false,
    defaultValue: 'info',
  })
  type!: 'info' | 'warning' | 'error' | 'success'

  @Column({
    type: DataType.ENUM('user', 'game', 'tournament', 'system', 'security'),
    allowNull: false,
    defaultValue: 'system',
  })
  category!: 'user' | 'game' | 'tournament' | 'system' | 'security'

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  read!: boolean

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId?: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  actionUrl?: string

  @BelongsTo(() => User)
  user?: User

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date
} 