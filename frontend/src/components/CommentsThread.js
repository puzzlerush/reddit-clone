import { Component } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import Comment from './Comment';
import ThemedBox from './ThemedBox';

class CommentsThread extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReplies: this.props.comments.map(() => true),
    };
  }

  toggleShowReplies = (idx) => {
    const showReplies = this.state.showReplies.slice();
    showReplies[idx] = !showReplies[idx];
    this.setState({ showReplies });
  }
    

  render() {
    const { showReplies } = this.state;
    const { comments } = this.props;
    const commentsToDisplay = comments.map(
      (
        {
          id,
          body,
          post_id,
          created_at,
          author_name,
          votes,
          has_voted,
          children,
        },
        idx
      ) => (
        <Box key={`${body}-${idx}`} mt={4}>
          <Comment
            id={id}
            my={2}
            body={body}
            postId={post_id}
            createdAt={created_at}
            author={author_name}
            numVotes={votes}
            hasVoted={has_voted}
          />
          {children.length > 0 && (
            <Button variant="link" onClick={() => this.toggleShowReplies(idx)}>
              {showReplies[idx]
                ? 'Hide replies'
                : `Show ${children.length} ${
                    children.length > 1 ? 'replies' : 'reply'
                  }`}
            </Button>
          )}
          {showReplies[idx] && (
            <Flex direction="row">
              {children.length > 0 && (
                <Box
                  alignSelf="stretch"
                  p={2}
                  role="group"
                  _hover={{ cursor: 'pointer' }}
                  onClick={() => this.toggleShowReplies(idx)}
                >
                  <ThemedBox
                    w={1}
                    h="100%"
                    _groupHover={{ backgroundColor: 'orange.400' }}
                  />
                </Box>
              )}
              <Box flexGrow={1} ml={4}>
                <CommentsThread
                  comments={children.filter(
                    ({ body, children }) => body !== null || children.length > 0
                  )}
                />
              </Box>
            </Flex>
          )}
        </Box>
      )
    );
    return commentsToDisplay;
  }
}

export default CommentsThread;
