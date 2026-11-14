export type CaptionSearchTarget = {
  content?: string | null;
  image_url?: string | null;
  image_description?: string | null;
  additional_context?: string | null;
  celebrity_recognition?: unknown;
};

export function extractSearchableRecognitionText(value: unknown): string[] {
  const collected: string[] = [];

  const pushText = (next: unknown) => {
    if (typeof next !== 'string') {
      return;
    }

    const trimmed = next.replace(/\s+/g, ' ').trim();
    if (trimmed && !collected.includes(trimmed)) {
      collected.push(trimmed);
    }
  };

  const walk = (node: unknown) => {
    if (node == null) {
      return;
    }

    if (typeof node === 'string') {
      pushText(node);
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item);
      }
      return;
    }

    if (typeof node !== 'object') {
      return;
    }

    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      const normalizedKey = key.toLowerCase();
      const isIgnoredField = [
        'confidence',
        'score',
        'similarity',
        'probability',
        'match_score',
      ].includes(normalizedKey);

      if (isIgnoredField) {
        continue;
      }

      const shouldWalkValue =
        normalizedKey === 'description' ||
        normalizedKey === 'name' ||
        normalizedKey === 'type' ||
        normalizedKey === 'scene_context' ||
        normalizedKey === 'content' ||
        normalizedKey === 'details' ||
        normalizedKey.includes('description') ||
        normalizedKey.includes('context') ||
        normalizedKey.includes('name') ||
        normalizedKey.includes('type');

      if (shouldWalkValue) {
        walk(value);
      }
    }
  };

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return collected;
    }

    try {
      const parsed = JSON.parse(trimmed);
      walk(parsed);
    } catch {
      walk(trimmed);
    }

    return collected;
  }

  walk(value);
  return collected;
}

export function matchesCaptionSearch(
  caption: CaptionSearchTarget,
  searchTerm: string,
): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return true;
  }

  const searchFields = [
    caption.content ?? '',
    caption.image_url ?? '',
    caption.image_description ?? '',
    caption.additional_context ?? '',
    ...extractSearchableRecognitionText(caption.celebrity_recognition),
  ];

  return searchFields.some((value) => value.toLowerCase().includes(normalizedSearchTerm));
}
