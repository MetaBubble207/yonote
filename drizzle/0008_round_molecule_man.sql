ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "plat_distributorship" SET DEFAULT 0.15;--> statement-breakpoint
ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "plat_distributorship" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "distributorship" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "distributorship" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "extend" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "yonote_distributorship_detail" ALTER COLUMN "extend" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "yonote_running_water" ADD COLUMN "is_freezed" boolean DEFAULT true NOT NULL;