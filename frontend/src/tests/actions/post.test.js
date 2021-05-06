import { setPost, editPost, deletePost } from '../../actions/post';
import { post } from '../fixtures/posts';

it('should create set post action', () => {
  const action = setPost(post);
  expect(action).toEqual({
    type: 'SET_POST',
    post,
  });
});

it('should create edit post action', () => {
  const updates = { body: 'updated body' };
  const action = editPost(1, updates);
  expect(action).toEqual({
    type: 'EDIT_POST',
    id: 1,
    updates,
  });
});

it('should create delete post action', () => {
  const action = deletePost(1);
  expect(action).toEqual({
    type: 'DELETE_POST',
    id: 1,
  });
});
