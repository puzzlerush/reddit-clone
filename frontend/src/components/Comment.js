import moment from 'moment';
import { Box, Flex, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import ThemedBox from './ThemedBox';
import UpvoteBar from './UpvoteBar';

const Comment = ({ body, createdAt, author, numVotes }) => {
  const { colorMode } = useColorMode();
  const commentDetailColor = 'gray.500';
  const commentDetailBgColor = colorMode === 'light' ? 'gray.100' : 'gray.600';
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
              _hover={{ backgroundColor: commentDetailBgColor }}
            >
              <ChatIcon mr={2} />
              Reply
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ThemedBox>
  );
};

export default Comment;
