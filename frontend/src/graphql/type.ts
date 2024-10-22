import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: Date; output: Date; }
};

export type ChatCompletionChoiceType = {
  __typename: 'ChatCompletionChoiceType';
  delta: ChatCompletionDeltaType;
  finish_reason?: Maybe<Scalars['String']['output']>;
  index: Scalars['Float']['output'];
};

export type ChatCompletionChunkType = {
  __typename: 'ChatCompletionChunkType';
  choices: Array<ChatCompletionChoiceType>;
  created: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  model: Scalars['String']['output'];
  object: Scalars['String']['output'];
  system_fingerprint?: Maybe<Scalars['String']['output']>;
};

export type ChatCompletionDeltaType = {
  __typename: 'ChatCompletionDeltaType';
  content?: Maybe<Scalars['String']['output']>;
};

export type ChatInputType = {
  message: Scalars['String']['input'];
};

export type CheckTokenInput = {
  token: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename: 'LoginResponse';
  access_token: Scalars['String']['output'];
};

export type LoginUserInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Menu = {
  __typename: 'Menu';
  created_at: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  is_deleted: Scalars['Boolean']['output'];
  last_updated: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  permission: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  deleteProject: Scalars['Boolean']['output'];
  login: LoginResponse;
  registerUser: User;
  removePackageFromProject: Scalars['Boolean']['output'];
  updateProjectPath: Scalars['Boolean']['output'];
  upsertProject: Projects;
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationRemovePackageFromProjectArgs = {
  packageId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationUpdateProjectPathArgs = {
  newPath: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationUpsertProjectArgs = {
  upsertProjectInput: UpsertProjectInput;
};

export type ProjectPackages = {
  __typename: 'ProjectPackages';
  content: Scalars['String']['output'];
  created_at: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  is_deleted: Scalars['Boolean']['output'];
  last_updated: Scalars['Date']['output'];
  project_id: Scalars['ID']['output'];
};

export type Projects = {
  __typename: 'Projects';
  created_at: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  is_deleted: Scalars['Boolean']['output'];
  last_updated: Scalars['Date']['output'];
  path: Scalars['String']['output'];
  projectPackages?: Maybe<Array<ProjectPackages>>;
  project_name: Scalars['String']['output'];
  user_id: Scalars['ID']['output'];
};

export type Query = {
  __typename: 'Query';
  checkToken: Scalars['Boolean']['output'];
  getProjectDetails: Projects;
  getUserProjects: Array<Projects>;
  logout: Scalars['Boolean']['output'];
};


export type QueryCheckTokenArgs = {
  input: CheckTokenInput;
};


export type QueryGetProjectDetailsArgs = {
  projectId: Scalars['String']['input'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename: 'Subscription';
  chatStream?: Maybe<ChatCompletionChunkType>;
};


export type SubscriptionChatStreamArgs = {
  input: ChatInputType;
};

export type UpsertProjectInput = {
  project_id?: InputMaybe<Scalars['ID']['input']>;
  project_name: Scalars['String']['input'];
  project_packages?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User = {
  __typename: 'User';
  created_at: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  is_deleted: Scalars['Boolean']['output'];
  last_updated: Scalars['Date']['output'];
  username: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChatCompletionChoiceType: ResolverTypeWrapper<ChatCompletionChoiceType>;
  ChatCompletionChunkType: ResolverTypeWrapper<ChatCompletionChunkType>;
  ChatCompletionDeltaType: ResolverTypeWrapper<ChatCompletionDeltaType>;
  ChatInputType: ChatInputType;
  CheckTokenInput: CheckTokenInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  LoginUserInput: LoginUserInput;
  Menu: ResolverTypeWrapper<Menu>;
  Mutation: ResolverTypeWrapper<{}>;
  ProjectPackages: ResolverTypeWrapper<ProjectPackages>;
  Projects: ResolverTypeWrapper<Projects>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpsertProjectInput: UpsertProjectInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ChatCompletionChoiceType: ChatCompletionChoiceType;
  ChatCompletionChunkType: ChatCompletionChunkType;
  ChatCompletionDeltaType: ChatCompletionDeltaType;
  ChatInputType: ChatInputType;
  CheckTokenInput: CheckTokenInput;
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  LoginResponse: LoginResponse;
  LoginUserInput: LoginUserInput;
  Menu: Menu;
  Mutation: {};
  ProjectPackages: ProjectPackages;
  Projects: Projects;
  Query: {};
  RegisterUserInput: RegisterUserInput;
  String: Scalars['String']['output'];
  Subscription: {};
  UpsertProjectInput: UpsertProjectInput;
  User: User;
}>;

export type ChatCompletionChoiceTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatCompletionChoiceType'] = ResolversParentTypes['ChatCompletionChoiceType']> = ResolversObject<{
  delta?: Resolver<ResolversTypes['ChatCompletionDeltaType'], ParentType, ContextType>;
  finish_reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChatCompletionChunkTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatCompletionChunkType'] = ResolversParentTypes['ChatCompletionChunkType']> = ResolversObject<{
  choices?: Resolver<Array<ResolversTypes['ChatCompletionChoiceType']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  system_fingerprint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChatCompletionDeltaTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatCompletionDeltaType'] = ResolversParentTypes['ChatCompletionDeltaType']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MenuResolvers<ContextType = any, ParentType extends ResolversParentTypes['Menu'] = ResolversParentTypes['Menu']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  last_updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  deleteProject?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'projectId'>>;
  login?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  registerUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'input'>>;
  removePackageFromProject?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemovePackageFromProjectArgs, 'packageId' | 'projectId'>>;
  updateProjectPath?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateProjectPathArgs, 'newPath' | 'projectId'>>;
  upsertProject?: Resolver<ResolversTypes['Projects'], ParentType, ContextType, RequireFields<MutationUpsertProjectArgs, 'upsertProjectInput'>>;
}>;

export type ProjectPackagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectPackages'] = ResolversParentTypes['ProjectPackages']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  last_updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  project_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Projects'] = ResolversParentTypes['Projects']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  last_updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectPackages?: Resolver<Maybe<Array<ResolversTypes['ProjectPackages']>>, ParentType, ContextType>;
  project_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  checkToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryCheckTokenArgs, 'input'>>;
  getProjectDetails?: Resolver<ResolversTypes['Projects'], ParentType, ContextType, RequireFields<QueryGetProjectDetailsArgs, 'projectId'>>;
  getUserProjects?: Resolver<Array<ResolversTypes['Projects']>, ParentType, ContextType>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  chatStream?: SubscriptionResolver<Maybe<ResolversTypes['ChatCompletionChunkType']>, "chatStream", ParentType, ContextType, RequireFields<SubscriptionChatStreamArgs, 'input'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  last_updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  ChatCompletionChoiceType?: ChatCompletionChoiceTypeResolvers<ContextType>;
  ChatCompletionChunkType?: ChatCompletionChunkTypeResolvers<ContextType>;
  ChatCompletionDeltaType?: ChatCompletionDeltaTypeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Menu?: MenuResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ProjectPackages?: ProjectPackagesResolvers<ContextType>;
  Projects?: ProjectsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

