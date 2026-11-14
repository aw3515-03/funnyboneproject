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

test('matches searchable image celebrity metadata while ignoring confidence values', () => {
  const recognition = {
    content: [
      {
        name: 'Nyan Cat',
        type: 'meme',
        confidence: 95,
        description: 'A popular internet meme featuring a pixelated cat with a Pop-Tart body.'
      }
    ],
    scene_context: 'This image represents the Nyan Cat meme.'
  }

  assert.equal(matchesCaptionSearch({ celebrity_recognition: recognition }, 'Nyan Cat'), true)
  assert.equal(matchesCaptionSearch({ celebrity_recognition: recognition }, 'meme'), true)
  assert.equal(matchesCaptionSearch({ celebrity_recognition: recognition }, '95'), false)
})
