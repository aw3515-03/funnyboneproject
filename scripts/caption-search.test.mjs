import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesCaptionSearch } from '../src/utils/caption-search.ts'

test('matches caption text case-insensitively and ignores extra spaces', () => {
  const result = matchesCaptionSearch({ content: '  My cat ate my homework  ' }, 'cat ate')
  assert.equal(result, true)
})

test('returns false when the search text is not present in the caption', () => {
  const result = matchesCaptionSearch({ content: 'The dog is funny' }, 'rocket')
  assert.equal(result, false)
})

test('returns true when no search text is provided', () => {
  const result = matchesCaptionSearch({ content: 'Something witty' }, '')
  assert.equal(result, true)
})
