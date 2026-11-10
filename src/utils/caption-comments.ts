export type CaptionComment = {
  id: string
  content: string
  createdAt: string
  author: string
  userId?: string | null
}

const STORAGE_PREFIX = 'funnybone-caption-comments-v1'
const MAX_COMMENT_LENGTH = 500
const inMemoryCommentStore = new Map<string, CaptionComment[]>()

export function getCaptionCommentStorageKey(captionId: string) {
  return `${STORAGE_PREFIX}:${captionId}`
}

export function normalizeComment(comment: Partial<CaptionComment>): CaptionComment | null {
  if (!comment || typeof comment !== 'object') {
    return null
  }

  const content = typeof comment.content === 'string' ? comment.content.trim() : ''
  const createdAt = typeof comment.createdAt === 'string' ? comment.createdAt : new Date().toISOString()
  const author = typeof comment.author === 'string' && comment.author.trim() ? comment.author.trim() : 'You'

  if (!content || !comment.id || typeof comment.id !== 'string') {
    return null
  }

  return {
    id: comment.id,
    content: content.slice(0, MAX_COMMENT_LENGTH),
    createdAt,
    author,
    userId: typeof comment.userId === 'string' ? comment.userId : null,
  }
}

export function getStoredCommentsForCaption(captionId: string): CaptionComment[] {
  if (typeof window !== 'undefined') {
    try {
      const rawComments = window.localStorage.getItem(getCaptionCommentStorageKey(captionId))
      if (!rawComments) {
        return inMemoryCommentStore.get(captionId) ?? []
      }

      const parsed = JSON.parse(rawComments)
      if (!Array.isArray(parsed)) {
        return []
      }

      const normalized = parsed
        .map((comment) => normalizeComment(comment as Partial<CaptionComment>))
        .filter((comment): comment is CaptionComment => Boolean(comment))

      inMemoryCommentStore.set(captionId, normalized)
      return normalized
    } catch (error) {
      console.error('Error reading caption comments:', error)
      return inMemoryCommentStore.get(captionId) ?? []
    }
  }

  return inMemoryCommentStore.get(captionId) ?? []
}

export function saveStoredCommentsForCaption(captionId: string, comments: CaptionComment[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(getCaptionCommentStorageKey(captionId), JSON.stringify(comments))
  }

  inMemoryCommentStore.set(captionId, comments)
  return comments
}

export function addCaptionComment(
  captionId: string,
  content: string,
  author = 'You',
  userId?: string | null,
) {
  const cleanedContent = content.trim()

  if (!cleanedContent) {
    throw new Error('Comment cannot be empty.')
  }

  if (cleanedContent.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be ${MAX_COMMENT_LENGTH} characters or less.`)
  }

  const nextComment: CaptionComment = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    content: cleanedContent,
    createdAt: new Date().toISOString(),
    author,
    userId: userId ?? null,
  }

  const existingComments = getStoredCommentsForCaption(captionId)
  const updatedComments = [...existingComments, nextComment]
  saveStoredCommentsForCaption(captionId, updatedComments)
  return updatedComments
}

export function clearCaptionCommentsForCaption(captionId: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(getCaptionCommentStorageKey(captionId))
  }

  inMemoryCommentStore.delete(captionId)
  return []
}
