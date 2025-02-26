ALTER TABLE "yonote_wallet" ALTER COLUMN "amount_withdraw" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "yonote_wallet" ALTER COLUMN "amount_withdraw" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "yonote_wallet" ALTER COLUMN "freeze_income" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "yonote_wallet" ALTER COLUMN "freeze_income" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "yonote_user" DROP COLUMN "we_chat";