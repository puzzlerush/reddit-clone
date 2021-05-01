import { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Box, Flex, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import ThemedBox from './ThemedBox';
import UpvoteBar from './UpvoteBar';
import WriteCommentBox from './WriteCommentBox';
import { userSelector } from '../selectors';

const Comment = ({
  id,
  body,
  postId,
  createdAt,
  author,
  numVotes,
  hasVoted,
  user,
}) => {
  const { colorMode } = useColorMode();
  const commentDetailColor = 'gray.500';
  const commentDetailBgColor = colorMode === 'light' ? 'gray.100' : 'gray.600';

  const [showWriteReply, setShowWriteReply] = useState(false);
  return (
    <ThemedBox
      p={4}
      borderRadius="md"
      width="100%"
      light="gray.50"
      dark="gray.700"
    >
      <Flex>
        <UpvoteBar size={5} numVotes={numVotes} voteValue={hasVoted} />
        <Box>
          <Text as="span" isTruncated>
            {author}
          </Text>{' '}
          <Text as="span" color="gray.500">
            <Tooltip label={moment(createdAt).format('LLLL')}>
              {moment(createdAt).fromNow()}
            </Tooltip>
          </Text>
          <Text>{body}</Text>
          <Flex
            mt={3}
            alignItems="center"
            color={commentDetailColor}
            fontWeight="bold"
          >
            <Box
              p={2}
              borderRadius="sm"
              _hover={{
                backgroundColor: commentDetailBgColor,
                cursor: 'pointer',
              }}
              onClick={() => setShowWriteReply(!showWriteReply)}
            >
              <ChatIcon mr={2} />
              Reply
            </Box>
          </Flex>
        </Box>
      </Flex>
      {showWriteReply && (
        <Box mt={2}>
          <Box m={2}>
            <Text as="span" color="gray.500">
              {'Reply to '}
            </Text>
            {author}
            <Text as="span" color="gray.500">
              {' as '}
            </Text>
            {user.username}
          </Box>
          <WriteCommentBox
            type="reply"
            postId={postId}
            parentCommentId={id}
            onClose={() => setShowWriteReply(false)}
          />
        </Box>
      )}
    </ThemedBox>
  );
};

const mapStateToProps = (state) => ({
  user: userSelector(state),
});

export default connect(mapStateToProps)(Comment);
