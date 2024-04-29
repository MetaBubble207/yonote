// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { dataTagSymbol } from "@tanstack/react-query";
import Password from "antd/es/input/Password";
import { sql } from "drizzle-orm";
import { date, float } from "drizzle-orm/mysql-core";
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
} from "drizzle-orm/pg-core";

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
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    readNumber: integer("readNumber"),
    likeCount: integer("likeCount"),
    content: varchar("content"),
    tag: varchar("tag"),
    status: boolean("status"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const user = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    phone: integer("phone"),
    idNumber: integer("idNumber"),
    Password: integer("password"),
    logo: bytea("logo"),
    idType: varchar("idType"),
    weChat: varchar("weChat"),
    enddate: timestamp("enddate"),
  }
);


export const column = createTable(
  "column",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    distributorship:boolean("distributorship").notNull().default(false),
    intriduce:varchar("intriduce"),
    type:varchar("type"),
    price:real("price"),
    logo:bytea("logo"),
    description:varchar("description"),
    payment:varchar("payment"),
  }
);

export const distributorshipDetail = createTable(
  "distributorshipDetail",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),

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
    updatedAt: timestamp("updatedAt"),
    price: real("price"),
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
    updatedAt: timestamp("updatedAt"),
    ownerID: serial("ownerID"),
    quantity: integer("quantity"),
    ranking: smallint("ranking"),
  }
);

export const wallet = createTable(
  "wallet",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
);

export const activity = createTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
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
    updatedAt: timestamp("updatedAt"),
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
    updatedAt: timestamp("updatedAt"),
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
    updatedAt: timestamp("updatedAt"),
  }
);

export type User = typeof user.$inferInsert
function bytea(arg0: string): any {
  throw new Error("Function not implemented.");
}

