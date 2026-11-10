export type CaptionSearchTarget = {
  content?: string | null;
  image_url?: string | null;
};

export function matchesCaptionSearch(
  caption: CaptionSearchTarget,
  searchTerm: string,
): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return true;
  }

  const searchFields = [caption.content ?? '', caption.image_url ?? ''];
  return searchFields.some((value) => value.toLowerCase().includes(normalizedSearchTerm));
}
