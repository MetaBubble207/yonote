import { PostSelect } from "@/server/db/schema";

export interface EditorProps {
    initialPostData?: PostSelect;
    initialDraftData?: PostSelect;
    initialColumnId: string;
}