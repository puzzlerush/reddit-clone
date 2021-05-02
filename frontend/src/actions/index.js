import axios from '../axios-config';
import { setPost } from './post';
import { setPostList } from './postList';
import { setComments } from './comments';
import { postSelector, postListSelector, commentsSelector } from '../selectors';

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

export const editPost = ({ id, body }) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'EDIT_POST_REQUEST' });
    await axios.put(`/posts/${id}`, { body });
    const post = postSelector(getState());
    if (post) {
      dispatch(setPost({ ...post, body }));
    }
    const postList = postListSelector(getState());
    const postIndex = postList.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      postList[postIndex] = {
        ...postList[postIndex],
        body,
      };
      dispatch(setPostList([...postList]));
    }

    dispatch({ type: 'EDIT_POST_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'EDIT_POST_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};

export const submitVote = ({ type, id, voteValue, newNumVotes }) => async (
  dispatch,
  getState
) => {
  if (!['post', 'comment'].includes(type)) {
    throw new Error('You can only submit votes for posts and comments');
  }

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
      await axios.post(`/votes/post`, {
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
    const changeCommentVote = ({ has_voted, votes }) => {
      let originalVoteValue;
      let originalNumVotes;
      const comments = commentsSelector(getState());
      const commentIndex = comments.findIndex((comment) => comment.id === id);
      if (commentIndex !== -1) {
        ({ has_voted: originalVoteValue, votes: originalNumVotes } = comments[
          commentIndex
        ]);
        comments[commentIndex] = {
          ...comments[commentIndex],
          has_voted,
          votes,
        };
        dispatch(setComments([...comments]));
      }
      return { originalVoteValue, originalNumVotes };
    };

    const { originalVoteValue, originalNumVotes } = changeCommentVote({
      has_voted: voteValue,
      votes: newNumVotes,
    });

    try {
      await axios.post(`/votes/comment`, {
        item_id: id,
        vote_value: voteValue,
      });
    } catch (e) {
      changeCommentVote({
        has_voted: originalVoteValue,
        votes: originalNumVotes,
      });
    }
  }
};
