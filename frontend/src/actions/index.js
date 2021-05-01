import axios from '../axios-config';
import { setPost } from './post';
import { setPostList } from './postList';
import { setComments } from './comments';
import { postSelector, postListSelector } from '../selectors';

export const getPostAndComments = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_POST_AND_COMMENTS_REQUEST' });
    const response = await axios.get(`/comments/${id}`);
    dispatch(setPost(response.data.post));
    dispatch(setComments(response.data.comments));
    dispatch({ type: 'GET_POST_AND_COMMENTS_SUCCESS' });
  } catch (e) {
    dispatch({ type: 'GET_POST_AND_COMMENTS_FAILURE', message: e.message });
  }
};

export const submitVote = ({ type, id, voteValue, newNumVotes }) => async (
  dispatch,
  getState
) => {
  if (!['post', 'comment'].includes(type)) {
    throw new Error('You can only submit votes for posts and comments');
  }

  try {
    dispatch({ type: 'SUBMIT_VOTE_REQUEST' });

    if (type === 'post') {
      const changePostVotes = ({ has_voted, votes }) => {
        let originalVoteValue;
        let originalNumVotes;
        const post = postSelector(getState());
        const newPostDetails = { has_voted, votes };
        const newPost = {
          ...post,
          ...newPostDetails,
        };
        if (post) {
          ({ has_voted: originalVoteValue, votes: originalNumVotes } = post);
          dispatch(setPost(newPost));
        }
        const postList = postListSelector(getState());
        const postIndex = postList.findIndex((post) => post.id === id);
        if (postIndex !== -1) {
          ({ has_voted: originalVoteValue, votes: originalNumVotes } = postList[
            postIndex
          ]);
          postList[postIndex] = {
            ...postList[postIndex],
            ...newPostDetails,
          };
          dispatch(setPostList([...postList]));
        }
        return { originalVoteValue, originalNumVotes };
      };
      const { originalVoteValue, originalNumVotes } = changePostVotes({
        has_voted: voteValue,
        votes: newNumVotes,
      });
      try {
        await axios.post(`/votes/${type}`, {
          item_id: id,
          vote_value: voteValue,
        });
      } catch (e) {
        changePostVotes({
          has_voted: originalVoteValue,
          votes: originalNumVotes,
        });
      }
    } else {
    }

    dispatch({ type: 'SUBMIT_VOTE_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'SUBMIT_VOTE_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
