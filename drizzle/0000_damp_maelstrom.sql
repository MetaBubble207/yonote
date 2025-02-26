CREATE TABLE "yonote_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"introduction" varchar(256) NOT NULL,
	"cover" varchar(256),
	"url" varchar(256) NOT NULL,
	"end_date" timestamp DEFAULT TIMESTAMP '2099-12-31 23:59:59' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_co_column" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"deadline" timestamp DEFAULT TIMESTAMP '2099-12-31 23:59:59' NOT NULL,
	"subscribers" integer,
	"number" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_column" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"distributorship" boolean DEFAULT false NOT NULL,
	"introduce" varchar,
	"type" varchar NOT NULL,
	"logo" text DEFAULT 'http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png',
	"description" varchar,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_column_recommendation" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"deadline" timestamp DEFAULT TIMESTAMP '2099-12-31 23:59:59' NOT NULL,
	"subscribers" integer,
	"number" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_course_recommendation" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"deadline" timestamp DEFAULT TIMESTAMP '2099-12-31 23:59:59' NOT NULL,
	"subscribers" integer,
	"number" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_distributorship_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"column_id" varchar NOT NULL,
	"plat_distributorship" real,
	"distributorship" real,
	"extend" real,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_invitation_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar
);
--> statement-breakpoint
CREATE TABLE "yonote_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"column_id" varchar NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"buyer_id" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"payment" varchar DEFAULT 'wallet' NOT NULL,
	"recommendation_id" varchar,
	"referral_level" integer,
	"status" boolean NOT NULL,
	"end_date" timestamp DEFAULT TIMESTAMP '2099-12-31 23:59:59' NOT NULL,
	"is_visable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"user_id" varchar NOT NULL,
	"readNumber" integer DEFAULT 0,
	"likeCount" integer DEFAULT 0,
	"content" varchar NOT NULL,
	"tag" varchar,
	"column_id" varchar NOT NULL,
	"is_top" boolean DEFAULT false,
	"is_free" boolean DEFAULT true,
	"status" boolean DEFAULT true,
	"logo" text,
	"chapter" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_post_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"is_like" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_post_read" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"read_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_price_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"column_id" varchar NOT NULL,
	"price" real NOT NULL,
	"time_limit" integer DEFAULT 9999999 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"column_id" varchar NOT NULL,
	"referred_user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_running_water" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"price" real NOT NULL,
	"expenditure_or_income" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_speed_up" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"owner_id" serial NOT NULL,
	"quantity" integer NOT NULL,
	"ranking" smallint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"column_id" varchar,
	"status" boolean,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "yonote_user" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"phone" varchar,
	"id_number" varchar NOT NULL,
	"password" integer,
	"avatar" text,
	"id_type" integer DEFAULT 0,
	"we_chat" varchar NOT NULL,
	"end_date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"sex" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonote_wallet" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"amount_withdraw" real,
	"freeze_income" real,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "yonote_post" USING btree ("name");