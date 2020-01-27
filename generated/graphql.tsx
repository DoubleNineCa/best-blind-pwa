type Maybe<T> = T | null;
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: any,
};

export type BaseEntityWithUuid = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
};

export type Customer = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  name: Scalars['String'],
  address: Scalars['String'],
  phone: Scalars['String'],
  email: Scalars['String'],
  orders: Array<Order>,
  type: Scalars['String'],
  note: Scalars['String'],
};


export type Grade = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  name: Scalars['String'],
  price: Scalars['Float'],
};

export type GradeInput = {
  name: Scalars['String'],
  price: Scalars['Float'],
};

export type Item = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  partId: Scalars['Float'],
  itemName: Scalars['String'],
  width: Scalars['Float'],
  height: Scalars['Float'],
  price: Scalars['Float'],
  handrailMaterial: Material,
  handrailType: Scalars['String'],
  handrailLength: Scalars['Float'],
  coverColor: Scalars['String'],
};

export type ItemInput = {
  width?: Maybe<Scalars['Float']>,
  height?: Maybe<Scalars['Float']>,
  handrailType?: Maybe<Scalars['String']>,
  handrailMaterial?: Maybe<Scalars['String']>,
  handrailLength: Scalars['Float'],
  coverColor: Scalars['String'],
};

export enum Material {
  Basic = 'BASIC',
  Crystal = 'CRYSTAL',
  Metal = 'METAL',
  Motor = 'MOTOR'
}

export type Mutation = {
  login?: Maybe<Staff>,
  registerStaff: Staff,
  registerCustomer: Customer,
  updateCustomer: Scalars['Boolean'],
  deleteCustomer: Scalars['Boolean'],
  registerGrade: Grade,
  updateGrade: Scalars['Boolean'],
  registerPart: Part,
  updatePart: Scalars['Boolean'],
  createItem: Item,
  updateItem: Scalars['Boolean'],
  deleteItem: Scalars['Boolean'],
  placeOrder: Order,
  updateOrder: Scalars['Boolean'],
  deleteOrder: Scalars['Boolean'],
};


export type MutationLoginArgs = {
  password: Scalars['String'],
  staffId: Scalars['String']
};


export type MutationRegisterStaffArgs = {
  data: RegisterInput
};


export type MutationRegisterCustomerArgs = {
  data: RegisterCustomerInput
};


export type MutationUpdateCustomerArgs = {
  data: UpdateCustomerInput,
  id: Scalars['Float']
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['Float']
};


export type MutationRegisterGradeArgs = {
  data: GradeInput
};


export type MutationUpdateGradeArgs = {
  data: GradeInput,
  gradeId: Scalars['Float']
};


export type MutationRegisterPartArgs = {
  data: PartInput
};


export type MutationUpdatePartArgs = {
  data: PartInput,
  partId: Scalars['Float']
};


export type MutationCreateItemArgs = {
  data: ItemInput,
  partId: Scalars['Float'],
  orderId: Scalars['Float']
};


export type MutationUpdateItemArgs = {
  data: ItemInput,
  partId: Scalars['Float'],
  itemId: Scalars['Float']
};


export type MutationDeleteItemArgs = {
  itemId: Scalars['Float']
};


export type MutationPlaceOrderArgs = {
  data: PlaceOrderInput
};


export type MutationUpdateOrderArgs = {
  data: PlaceOrderInput,
  installDate: Scalars['DateTime'],
  orderId: Scalars['Float']
};


export type MutationDeleteOrderArgs = {
  id: Scalars['Float']
};

export type Order = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  orderNo: Scalars['String'],
  hst: Scalars['Boolean'],
  deposit: Scalars['Float'],
  discount: Scalars['Float'],
  installation: Scalars['Float'],
  installationDiscount: Scalars['Float'],
  total?: Maybe<Scalars['Float']>,
  items?: Maybe<Array<Item>>,
  status: Status,
  payment: Scalars['String'],
  orderDate: Scalars['DateTime'],
  installDate?: Maybe<Scalars['DateTime']>,
  customer: Customer,
};

export type Part = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  type: Scalars['String'],
  kind: Scalars['String'],
  name: Scalars['String'],
  color: Scalars['String'],
  manufacturer: Scalars['String'],
  grade: Scalars['String'],
  modelNo?: Maybe<Scalars['String']>,
  stocks: Scalars['Float'],
};

export type PartInput = {
  type: Scalars['String'],
  kind?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  color?: Maybe<Scalars['String']>,
  manufacturer?: Maybe<Scalars['String']>,
  grade?: Maybe<Scalars['String']>,
  modelNo?: Maybe<Scalars['String']>,
  stocks?: Maybe<Scalars['Float']>,
};

export type PlaceOrderInput = {
  customerId: Scalars['Float'],
  orderNo: Scalars['String'],
  hst?: Maybe<Scalars['Boolean']>,
  deposit?: Maybe<Scalars['Float']>,
  discount?: Maybe<Scalars['Float']>,
  installation?: Maybe<Scalars['Float']>,
  installationDiscount?: Maybe<Scalars['Float']>,
  status?: Maybe<Scalars['String']>,
  payment?: Maybe<Scalars['String']>,
};

export type Query = {
  getCustomers: Array<Customer>,
  getCustomer: Customer,
  getGrades: Array<Grade>,
  getParts: Array<Part>,
  getOrder: Order,
  getOrders: Array<Order>,
};


export type QueryGetCustomerArgs = {
  id: Scalars['Float']
};


export type QueryGetPartsArgs = {
  keyword: Scalars['String'],
  type: Scalars['String']
};


export type QueryGetOrderArgs = {
  orderNo: Scalars['String']
};

export type RegisterCustomerInput = {
  name: Scalars['String'],
  address: Scalars['String'],
  phone: Scalars['String'],
  email: Scalars['String'],
  note: Scalars['String'],
};

export type RegisterInput = {
  staffId: Scalars['String'],
  password: Scalars['String'],
};

export type Staff = {
  id: Scalars['ID'],
  uuid: Scalars['String'],
  staffId: Scalars['String'],
  password: Scalars['String'],
};

export enum Status {
  Measure = 'MEASURE',
  Manufacture = 'MANUFACTURE',
  Install = 'INSTALL',
  Ramaining = 'RAMAINING',
  Complete = 'COMPLETE'
}

export type UpdateCustomerInput = {
  name?: Maybe<Scalars['String']>,
  address?: Maybe<Scalars['String']>,
  phone?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  note?: Maybe<Scalars['String']>,
};

export type Unnamed_1_QueryVariables = {};


export type Unnamed_1_Query = ({ __typename?: 'Query' } & { getGrades: Array<({ __typename?: 'Grade' } & Pick<Grade, 'id' | 'name' | 'price'>)> });

export type Unnamed_2_QueryVariables = {};


export type Unnamed_2_Query = ({ __typename?: 'Query' } & { getOrders: Array<({ __typename?: 'Order' } & Pick<Order, 'id' | 'orderNo' | 'hst' | 'deposit' | 'discount' | 'installationDiscount' | 'payment' | 'orderDate' | 'installDate' | 'total'> & { items: Maybe<Array<({ __typename?: 'Item' } & Pick<Item, 'id' | 'partId' | 'width' | 'price' | 'height' | 'price' | 'handrailType' | 'handrailMaterial'>)>>, customer: ({ __typename?: 'Customer' } & Pick<Customer, 'name' | 'address'>) })> });

export type Unnamed_3_MutationVariables = {
  input: GradeInput
};


export type Unnamed_3_Mutation = ({ __typename?: 'Mutation' } & { registerGrade: ({ __typename?: 'Grade' } & Pick<Grade, 'id' | 'name' | 'price'>) });


import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';

export type ArrayOrIterable<T> = Array<T> | Iterable<T>;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface ISubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export type BaseEntityWithUuidResolvers<Context = any, ParentType = BaseEntityWithUuid> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
}>;

export type CustomerResolvers<Context = any, ParentType = Customer> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  address?: Resolver<Scalars['String'], ParentType, Context>,
  phone?: Resolver<Scalars['String'], ParentType, Context>,
  email?: Resolver<Scalars['String'], ParentType, Context>,
  orders?: Resolver<ArrayOrIterable<Order>, ParentType, Context>,
  type?: Resolver<Scalars['String'], ParentType, Context>,
  note?: Resolver<Scalars['String'], ParentType, Context>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<Scalars['DateTime'], any> {
  name: 'DateTime'
}

export type GradeResolvers<Context = any, ParentType = Grade> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  price?: Resolver<Scalars['Float'], ParentType, Context>,
}>;

export type ItemResolvers<Context = any, ParentType = Item> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  partId?: Resolver<Scalars['Float'], ParentType, Context>,
  itemName?: Resolver<Scalars['String'], ParentType, Context>,
  width?: Resolver<Scalars['Float'], ParentType, Context>,
  height?: Resolver<Scalars['Float'], ParentType, Context>,
  price?: Resolver<Scalars['Float'], ParentType, Context>,
  handrailMaterial?: Resolver<Material, ParentType, Context>,
  handrailType?: Resolver<Scalars['String'], ParentType, Context>,
  handrailLength?: Resolver<Scalars['Float'], ParentType, Context>,
  coverColor?: Resolver<Scalars['String'], ParentType, Context>,
}>;

export type MutationResolvers<Context = any, ParentType = Mutation> = ResolversObject<{
  login?: Resolver<Maybe<Staff>, ParentType, Context, MutationLoginArgs>,
  registerStaff?: Resolver<Staff, ParentType, Context, MutationRegisterStaffArgs>,
  registerCustomer?: Resolver<Customer, ParentType, Context, MutationRegisterCustomerArgs>,
  updateCustomer?: Resolver<Scalars['Boolean'], ParentType, Context, MutationUpdateCustomerArgs>,
  deleteCustomer?: Resolver<Scalars['Boolean'], ParentType, Context, MutationDeleteCustomerArgs>,
  registerGrade?: Resolver<Grade, ParentType, Context, MutationRegisterGradeArgs>,
  updateGrade?: Resolver<Scalars['Boolean'], ParentType, Context, MutationUpdateGradeArgs>,
  registerPart?: Resolver<Part, ParentType, Context, MutationRegisterPartArgs>,
  updatePart?: Resolver<Scalars['Boolean'], ParentType, Context, MutationUpdatePartArgs>,
  createItem?: Resolver<Item, ParentType, Context, MutationCreateItemArgs>,
  updateItem?: Resolver<Scalars['Boolean'], ParentType, Context, MutationUpdateItemArgs>,
  deleteItem?: Resolver<Scalars['Boolean'], ParentType, Context, MutationDeleteItemArgs>,
  placeOrder?: Resolver<Order, ParentType, Context, MutationPlaceOrderArgs>,
  updateOrder?: Resolver<Scalars['Boolean'], ParentType, Context, MutationUpdateOrderArgs>,
  deleteOrder?: Resolver<Scalars['Boolean'], ParentType, Context, MutationDeleteOrderArgs>,
}>;

export type OrderResolvers<Context = any, ParentType = Order> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  orderNo?: Resolver<Scalars['String'], ParentType, Context>,
  hst?: Resolver<Scalars['Boolean'], ParentType, Context>,
  deposit?: Resolver<Scalars['Float'], ParentType, Context>,
  discount?: Resolver<Scalars['Float'], ParentType, Context>,
  installation?: Resolver<Scalars['Float'], ParentType, Context>,
  installationDiscount?: Resolver<Scalars['Float'], ParentType, Context>,
  total?: Resolver<Maybe<Scalars['Float']>, ParentType, Context>,
  items?: Resolver<Maybe<ArrayOrIterable<Item>>, ParentType, Context>,
  status?: Resolver<Status, ParentType, Context>,
  payment?: Resolver<Scalars['String'], ParentType, Context>,
  orderDate?: Resolver<Scalars['DateTime'], ParentType, Context>,
  installDate?: Resolver<Maybe<Scalars['DateTime']>, ParentType, Context>,
  customer?: Resolver<Customer, ParentType, Context>,
}>;

export type PartResolvers<Context = any, ParentType = Part> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  type?: Resolver<Scalars['String'], ParentType, Context>,
  kind?: Resolver<Scalars['String'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  color?: Resolver<Scalars['String'], ParentType, Context>,
  manufacturer?: Resolver<Scalars['String'], ParentType, Context>,
  grade?: Resolver<Scalars['String'], ParentType, Context>,
  modelNo?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
  stocks?: Resolver<Scalars['Float'], ParentType, Context>,
}>;

export type QueryResolvers<Context = any, ParentType = Query> = ResolversObject<{
  getCustomers?: Resolver<ArrayOrIterable<Customer>, ParentType, Context>,
  getCustomer?: Resolver<Customer, ParentType, Context, QueryGetCustomerArgs>,
  getGrades?: Resolver<ArrayOrIterable<Grade>, ParentType, Context>,
  getParts?: Resolver<ArrayOrIterable<Part>, ParentType, Context, QueryGetPartsArgs>,
  getOrder?: Resolver<Order, ParentType, Context, QueryGetOrderArgs>,
  getOrders?: Resolver<ArrayOrIterable<Order>, ParentType, Context>,
}>;

export type StaffResolvers<Context = any, ParentType = Staff> = ResolversObject<{
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  uuid?: Resolver<Scalars['String'], ParentType, Context>,
  staffId?: Resolver<Scalars['String'], ParentType, Context>,
  password?: Resolver<Scalars['String'], ParentType, Context>,
}>;

export type IResolvers<Context = any> = ResolversObject<{
  BaseEntityWithUuid?: BaseEntityWithUuidResolvers<Context>,
  Customer?: CustomerResolvers<Context>,
  DateTime?: GraphQLScalarType,
  Grade?: GradeResolvers<Context>,
  Item?: ItemResolvers<Context>,
  Mutation?: MutationResolvers<Context>,
  Order?: OrderResolvers<Context>,
  Part?: PartResolvers<Context>,
  Query?: QueryResolvers<Context>,
  Staff?: StaffResolvers<Context>,
}>;

export type IDirectiveResolvers<Context = any> = {};


import gql from 'graphql-tag';
import * as React from 'react';
import * as ReactApollo from 'react-apollo';
