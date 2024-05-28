// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { char } from "drizzle-orm/mysql-core";
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
  decimal,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `yonote_${name}`);
export const subscription_manager = createTable(
  "subscription_manager",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id"),
    columnId: varchar("column_id"),
    status: boolean("status"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  }
);
export const post = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    userID: varchar("user_id"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    readNumber: integer("readNumber"),
    likeCount: integer("likeCount"),
    content: varchar("content"),
    tag: varchar("tag"),
    columnId: varchar("column_id"),
    isTop: boolean("is_top").default(false),
    isFree: boolean("is_free").default(false),
    status: boolean("status"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const user = createTable(
  "user",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    phone: varchar("phone"),
    idNumber: varchar("id_number"),
    password: integer("password"),
    avatar: text("avatar"),
    idType: varchar("id_type"),
    weChat: varchar("we_chat"),
    endDate: timestamp("end_date"),
    sex: integer("sex"),
  }
);


export const column = createTable(
  "column",
  {
    id: varchar("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    distributorship: boolean("distributorship").notNull().default(false),
    introduce: varchar("introduce"),
    type: varchar("type"),
    price: real("price"),
    logo: text("logo"),
    description: varchar("description"),
    payment: varchar("payment"),
    userId: varchar("user_id"),
  }
);
export const distributorshipDetail = createTable(
  "distributorshipDetail",
  {
    id: serial("id").primaryKey(),
    columnID: serial("columnID"),
    platDistributorship: integer("platDistributorship"),
    speedUp: integer("speedUp"),
    writerMoney: real("writerMoney"),
    Price: real("columnPrice"),
    distributorship: integer("distributorship"),
  }
);

export const order = createTable(
  "order",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    price: real("price"),
    buyerID:serial("buyerID"),
    ownerID: serial("ownerID"),
    payment: varchar("payment"),
    endStatus: boolean("status"),
    recommendationID: serial("recommendationID"),
    status: boolean("status"),
    type: varchar("type"),
    enddate: timestamp("enddate"),
  }
);

export const speedUp = createTable(
  "speedUp",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    ownerID: serial("ownerID"),
    quantity: integer("quantity"),
    ranking: smallint("ranking"),
  }
);

export const wallet = createTable(
  "wallet",
  {
    userId: varchar("user_id").notNull(),
    regularIncome: real("regularIncome"),
    freezeIncome: real("regularOutcome"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  }
);

export const activity = createTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    name:varchar("name",{length:256}),
    introduction: varchar("introduction", { length: 256 }),
    url: varchar("url", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    isEnd:boolean("isEnd")
  }
);

export const coColumn = createTable(
  "coColumn",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    deadline: timestamp("deadline"),
    subscribers: integer("subscribers"),
    number: integer("number"),
  }
);

export const courseRecommendation = createTable(
  "courseRecommendation",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    deadline: timestamp("deadline"),
    subscribers: integer("subscribers"),
    number: integer("number"),
  }
);

export const columnRecommendation = createTable(
  "columnRecommendation",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    deadline: timestamp("deadline"),
    subscribers: integer("subscribers"),
    number: integer("number"),
  }
);

export const postLike = createTable(
  "postLike",
  {
    id: serial("id").primaryKey(),
    postId: integer("postId"),
    userId: varchar("userId"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
    isLike: boolean("isLike"),
  }
);

export type User = typeof user.$inferInsert
