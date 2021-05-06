import {
  setComments,
  updateComment,
  deleteComment,
} from '../../actions/comments';
import { comments } from '../fixtures/comments';

it('should create set comments action', () => {
  const action = setComments(comments);
  expect(action).toEqual({
    type: 'SET_COMMENTS',
    comments,
  });
});

it('should create update comment action', () => {
  const updates = { body: 'updated body' };
  const action = updateComment(1, updates);
  expect(action).toEqual({
    type: 'UPDATE_COMMENT',
    id: 1,
    updates,
  });
});

it('should create delete comment action', () => {
  const action = deleteComment(1);
  expect(action).toEqual({
    type: 'DELETE_COMMENT',
    id: 1,
  });
});
