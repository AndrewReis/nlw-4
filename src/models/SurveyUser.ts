import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import Surveys from './Surveys';
import User from './User';


@Entity('surveys_users')
class SurveysUsers {

  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  survey_id: string;

  @ManyToOne(() => Surveys)
  @JoinColumn({ name: 'survey_id' })
  survey: Surveys;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default SurveysUsers;
