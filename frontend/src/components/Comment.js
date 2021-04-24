import moment from 'moment';
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import ThemedBox from './ThemedBox';
import UpvoteBar from './UpvoteBar';

const Comment = ({ body, createdAt, author, numVotes }) => {
  return (
    <ThemedBox
      p={4}
      borderRadius="md"
      width="100%"
      light="gray.50"
      dark="gray.700"
    >
      <Flex>
        <UpvoteBar size={5} numVotes={numVotes} />
        <Box>
          <Text as="span" isTruncated>
            {author}
          </Text>
          {' '}
          <Text as="span" color="gray.400">
            <Tooltip label={moment(createdAt).format('LLLL')}>
              {moment(createdAt).fromNow()}
            </Tooltip>
          </Text>
          <Text>
            {body}
          </Text>
        </Box>
      </Flex>
    </ThemedBox>
  );
};

export default Comment;