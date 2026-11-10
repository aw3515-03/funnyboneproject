"use server";

import { createClient } from "@/utils/supabase/server";

export type CaptionCommentRecord = {
  id: string;
  caption_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  created_by_user_id?: string | null;
};

export async function fetchCaptionCommentsAction(captionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("caption_comments")
    .select("id, caption_id, profile_id, content, created_at, created_by_user_id")
    .eq("caption_id", captionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load caption comments:", error);
    return [] as CaptionCommentRecord[];
  }

  return (data ?? []) as CaptionCommentRecord[];
}
