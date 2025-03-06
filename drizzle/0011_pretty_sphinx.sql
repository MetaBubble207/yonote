DROP TABLE "yonote_column_recommendation" CASCADE;--> statement-breakpoint
DROP TABLE "yonote_course_recommendation" CASCADE;--> statement-breakpoint
DROP TABLE "yonote_speed_up" CASCADE;--> statement-breakpoint
ALTER TABLE "yonote_activity" RENAME COLUMN "end_date" TO "expiration_at";--> statement-breakpoint
ALTER TABLE "yonote_column" RENAME COLUMN "logo" TO "cover";--> statement-breakpoint
ALTER TABLE "yonote_order" RENAME COLUMN "recommendation_id" TO "recommender_id";--> statement-breakpoint
ALTER TABLE "yonote_order" RENAME COLUMN "end_date" TO "expiration_at";--> statement-breakpoint
ALTER TABLE "yonote_order" RENAME COLUMN "is_visable" TO "is_visible";--> statement-breakpoint
ALTER TABLE "yonote_referrals" RENAME COLUMN "referred_user_id" TO "recommender_id";--> statement-breakpoint
ALTER TABLE "yonote_user" RENAME COLUMN "id_type" TO "type";--> statement-breakpoint
ALTER TABLE "yonote_user" RENAME COLUMN "end_date" TO "last_login_at";