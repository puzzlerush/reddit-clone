import { Component } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import Comment from './Comment';
import ThemedBox from './ThemedBox';

class CommentsThread extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReplies: true
    };
  }

  toggleShowReplies = () => this.setState((prevState) => ({ showReplies: !prevState.showReplies }))

  render() {
    const { showReplies } = this.state;
    const { comments, indent } = this.props;
    const commentsToDisplay = comments.map(({ body, created_at, author_name, votes, children }, idx) => (
      <Box key={`${body}-${idx}`} my={2} ml={indent}>
        <Comment
          my={2}
          body={body}
          createdAt={created_at}
          author={author_name}
          numVotes={votes}
        />
        {children.length > 0 && (
          <Button variant="link" onClick={this.toggleShowReplies}>
            {showReplies ? 'Hide replies' : `Show ${children.length} ${children.length > 1 ? 'replies' : 'reply'}`}
          </Button>
        )}
        {showReplies && (
          <Flex direction="row">
            {children.length > 0 && <ThemedBox ml={2} w={1} alignSelf="stretch" />}
            <Box flexGrow={1}>
              <CommentsThread comments={children} indent={indent + 4} />
            </Box>

          </Flex>
        )}
      </Box>

    ));
    return (
      <Box>
        {commentsToDisplay}
      </Box>
    );
  }
}

export default CommentsThread;