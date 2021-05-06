import { setSubreddits } from '../../actions/subreddits';
import { subreddits } from '../fixtures/subreddits';

it('should create set subreddits action', () => {
  const action = setSubreddits(subreddits);
  expect(action).toEqual({
    type: 'SET_SUBREDDITS',
    subreddits,
  });
});
