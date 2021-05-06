import { setPostList } from '../../actions/postList';
import { postList } from '../fixtures/posts';

it('should create set post list action', () => {
  const action = setPostList(postList);
  expect(action).toEqual({
    type: 'SET_POST_LIST',
    postList,
  });
});
