import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import { distributorshipDetail } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getOneDistributorshipDetail = (
    db: PostgresJsDatabase<typeof schema>,
    id: string,
) => {
    return db.query.distributorshipDetail.findFirst({
        where: eq(distributorshipDetail.columnId, id),
    });
};