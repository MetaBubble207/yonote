// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  boolean,
  real,
  integer,
  smallint,
  text,
} from "drizzle-orm/pg-core";
import { number } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `yonote_${name}`);
export const post = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    content: varchar("content").notNull(),
    tag: varchar("tag"),
    columnId: varchar("column_id").notNull(),
    isTop: boolean("is_top").notNull().default(false),
    isFree: boolean("is_free").notNull().default(true),
    status: boolean("status").default(true),// 是否是草稿
    cover: text("cover"),
    chapter: integer("chapter").notNull(),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (example) => [
    index("name_idx").on(example.name),
  ],
);

export const user = createTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }),
  phone: varchar("phone"),
  idNumber: varchar("id_number").notNull(),
  password: integer("password"),
  avatar: text("avatar"),
  idType: integer("type").default(0), //是否是会员
  endDate: timestamp("last_login_at")
    .defaultNow()
    .notNull(),
  sex: integer("sex"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const column = createTable("column", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  distributorship: boolean("distributorship").notNull().default(false), // 是否是共创计划
  introduce: varchar("introduce"),
  type: integer("type").notNull().default(0), // 0: column, 1: course
  cover: text("cover").default(
    "http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png",
  ),
  description: varchar("description"),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const distributorshipDetail = createTable("distributorship_detail", {
  id: serial("id").primaryKey(),
  columnId: varchar("column_id").notNull(),
  platDistributorship: real("plat_distributorship").notNull().default(0.15),
  distributorship: real("distributorship").notNull().default(0),
  extend: real("extend").notNull().default(0),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const order = createTable("order", {
  id: serial("id").primaryKey(),
  columnId: varchar("column_id").notNull(),
  price: real("price").notNull().default(0),
  buyerId: varchar("buyer_id").notNull(),
  ownerId: varchar("owner_id").notNull(),
  payment: varchar("payment").notNull().default('wallet'),
  recommendationId: varchar("recommender_id"),
  referralLevel: integer("referral_level"),
  status: boolean("status").notNull(),
  endDate: timestamp("expiration_at")
    .notNull()
    .default(sql`TIMESTAMP '2099-12-31 23:59:59'`),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const wallet = createTable("wallet", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  amountWithdraw: real("amount_withdraw").notNull().default(0),
  freezeIncome: real("freeze_income").notNull().default(0),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const activity = createTable("activity", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  introduction: varchar("introduction", { length: 256 }).notNull(),
  cover: varchar("cover", { length: 256 }),
  url: varchar("url", { length: 256 }).notNull(),
  endDate: timestamp("expiration_at").notNull().default(sql`TIMESTAMP '2099-12-31 23:59:59'`),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const coColumn = createTable("co_column", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  deadline: timestamp("deadline").notNull().default(sql`TIMESTAMP '2099-12-31 23:59:59'`),
  subscribers: integer("subscribers"),
  number: integer("number"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const postLike = createTable("post_like", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  isLike: boolean("is_like").notNull().default(true),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const postRead = createTable("post_read", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  readCount: integer("read_count").notNull().default(0),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const invitationCode = createTable("invitation_code", {
  id: serial("id").primaryKey(),
  value: varchar("value"),
});
export const referrals = createTable("referrals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  columnId: varchar("column_id").notNull(),
  referredUserId: varchar("recommender_id").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
export const priceList = createTable("price_list", {
  id: serial("id").primaryKey(),
  columnId: varchar("column_id").notNull(),
  price: real("price").notNull(),
  timeLimit: integer("time_limit").notNull().default(9999999),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const runningWater = createTable("running_water", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  price: real("price").notNull(),
  expenditureOrIncome: integer("expenditure_or_income").notNull(),
  isFreezed: boolean("is_freezed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserInsert = typeof user.$inferInsert;
export type UserSelect = typeof user.$inferSelect;
export type RunningWaterSelect = typeof runningWater.$inferSelect;
export type ColumnSelect = typeof column.$inferSelect;
export type PriceListSelect = typeof priceList.$inferSelect;
export type OrderSelect = typeof order.$inferSelect;
export type ColumnUser = {
  column: typeof column.$inferSelect;
  user: typeof user.$inferSelect;
};
export type ColumnOrder = {
  column: typeof column.$inferSelect;
  order: typeof order.$inferSelect;
};

export type PostSelect = typeof post.$inferSelect;
export type BaseUserInfo = {
  userId: string;
  idType: number;
  userName: string;
  avatar: string;
};
export type OrderBuyer = {
  id: number;
  columnId: string;
  price: number;
  buyerId: string;
  ownerId: string;
  payment: string;
  recommendationId: string;
  referralLevel: number;
  status: boolean;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isVisible: boolean;
  userName: string;
};

export type BaseColumnCard = ColumnSelect & {
  userId: string;
  userName: string;
  idType: number;
  avatar: string;
  isVisible?: boolean;
};

// 使用 Omit 排除原有的 Date 类型字段，然后添加字符串类型的日期字段
export type BaseColumnCardDateString = Omit<BaseColumnCard, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type DetailColumnCard = BaseColumnCard & {
  readCount: number;
  likeCount: number;
  subscriptionCount: number;
  postCount: number;
  isTop: boolean;
  isFree: boolean;
};

export type DetailPostCard = BaseUserInfo & {
  id?: number;
  name?: string;
  content?: string;
  tag?: string;
  columnId?: string;
  isTop?: boolean;
  isFree?: boolean;
  status?: boolean;
  cover?: string;
  chapter?: number;
  createdAt?: Date;
  updatedAt?: Date;
  readCount?: number;
  likeCount?: number;
};

export type PostDetail = {
  detailPostCard: DetailPostCard[];
  subscriptCount: number;
};
// 原本设计稿要求的类型，有加速量，加速量就是分销量和推广量只和
export type SpeedUpBack = {
  id: number;
  avatar: string;
  username: string;
  userId: string;
  acceleratedTotal: number;
  totalPrice: number;
};

export type SpeedUp = {
  id: number;
  avatar: string;
  username: string;
  userId: string;
  distributionCount: number;  // 分销数量
  promotionCount: number;     // 推广数量
  totalPrice: number;
};

export type DetailPost = PostSelect & {
  user: UserSelect
}