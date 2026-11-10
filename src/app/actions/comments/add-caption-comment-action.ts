"use server";

import { createClient } from "@/utils/supabase/server";

export async function addCaptionCommentAction(captionId: string, content: string) {
  const supabase = await createClient();
  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error("Comment cannot be empty.");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Login required to comment.");
  }

  const { data, error } = await supabase
    .from("caption_comments")
    .insert({
      caption_id: captionId,
      profile_id: user.id,
      content: trimmed,
      created_by_user_id: user.id,
      modified_by_user_id: user.id,
    })
    .select("id, caption_id, profile_id, content, created_at, created_by_user_id")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add comment.");
  }

  return data;
}
