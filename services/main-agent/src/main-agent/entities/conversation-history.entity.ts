import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class ConversationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contextId: string;

  @Column('json')
  history: any[];

  @Column()
  lastUsed: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 