import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SystemBaseModel } from 'src/system-base-model/system-base.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.model';
import { ProjectPackages } from './project-packages.model';

@Entity()
@ObjectType()
export class Projects extends SystemBaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  project_name: string;

  @Field()
  @Column()
  path: string;

  @Field(() => ID)
  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @Field(() => [ProjectPackages], { nullable: true })
  @OneToMany(() => ProjectPackages, (projectPackage) => projectPackage.project, { cascade: true })
  projectPackages: ProjectPackages[];
}
