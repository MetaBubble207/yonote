// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {sql} from "drizzle-orm";
import {char} from "drizzle-orm/mysql-core";
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
export const subscription = createTable(
    "subscription",
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
        name: varchar("name", {length: 256}),
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
        logo: text("logo"),
        chapter: integer("chapter"),
    },
    (example) => ({
        nameIndex: index("name_idx").on(example.name),
    })
);

export const user = createTable(
    "user",
    {
        id: varchar("id", {length: 256}).primaryKey(),
        name: varchar("name", {length: 256}),
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
        name: varchar("name", {length: 256}),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at"),
        distributorship: boolean("distributorship").notNull().default(false),
        introduce: varchar("introduce"),
        type: varchar("type"),
        price: real("price"),
        logo: text("logo").default("http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png"),
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
        columnId: varchar("column_id"),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        price: real("price"),
        buyerId: varchar("buyer_id"),
        ownerId: varchar("owner_id"),
        payment: varchar("payment"),
        endStatus: boolean("end_status"),
        recommendationId: varchar("recommendation_id"),
        status: boolean("status"),
        endDate: timestamp("end_date"),
        isVisable: boolean("is_visable"),
    }
);

export const speedUp = createTable(
    "speedUp",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", {length: 256}),
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
        name: varchar("name", {length: 256}),
        introduction: varchar("introduction", {length: 256}),
        cover: varchar("cover", {length: 256}),
        url: varchar("url", {length: 256}),
        endDate: timestamp("end_date"),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at"),
    }
);

export const coColumn = createTable(
    "coColumn",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", {length: 256}),
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
        name: varchar("name", {length: 256}),
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
        name: varchar("name", {length: 256}),
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

export const postRead = createTable(
    "postRead",
    {
        id: serial("id").primaryKey(),
        postId: integer("postId"),
        userId: varchar("userId"),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at"),
        readCount: integer("readCount"),
    }
)


export type User = typeof user.$inferInsert
