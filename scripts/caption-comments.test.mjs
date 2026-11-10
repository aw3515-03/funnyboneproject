import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addCaptionComment,
  clearCaptionCommentsForCaption,
  getStoredCommentsForCaption,
} from '../src/utils/caption-comments.ts';

test('caption comments are stored and blank comments are rejected', () => {
  const captionId = 'test-caption-1';
  clearCaptionCommentsForCaption(captionId);

  const comments = addCaptionComment(captionId, '  this is hilarious  ');
  assert.equal(comments.length, 1);
  assert.equal(comments[0].content, 'this is hilarious');
  assert.ok(comments[0].id);

  assert.throws(() => addCaptionComment(captionId, '   '), /empty/i);
  assert.equal(getStoredCommentsForCaption(captionId).length, 1);

  clearCaptionCommentsForCaption(captionId);
  assert.deepEqual(getStoredCommentsForCaption(captionId), []);
});
