// DTOs for Project APIs
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpsertProjectInput {
  @Field()
  project_name: string;

  @Field()
  path: string;

  @Field(() => ID)
  user_id: string;

  @Field(() => ID, { nullable: true })
  project_id: string;

  // may need
  // @Field(() => [String])
  // project_packages: string[];
}
