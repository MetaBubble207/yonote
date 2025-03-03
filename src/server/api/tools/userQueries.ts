import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { user } from "@/server/db/schema";

export const getOneUser = async (
    db: PostgresJsDatabase<typeof schema>,
    id: string,
) => {
    if (id === "") return null;
    const data = await db.query.user.findFirst({ where: eq(user.id, id) });
    if (data) {
        return data;
    } else {
        return null;
    }
};