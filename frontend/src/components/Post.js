import moment from 'moment';
import { Text, Heading, Box, Flex, Tooltip, useColorMode } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import ThemedBox from './ThemedBox';
import UpvoteBar from './UpvoteBar';

const Post = ({ subreddit, author, createdAt, title, body, numVotes, numComments }) => {
  const { colorMode } = useColorMode();
  const postDetailColor = 'gray.400';
  const postDetailBgColor = colorMode === 'light' ? 'gray.100' : 'gray.600';
  return (
    <ThemedBox
      p={4}
      borderRadius="md"
      width="100%"
      light="gray.50"
      dark="gray.700"
    >
      <Flex>
        <UpvoteBar numVotes={numVotes} />
        <Box>
          <Text as="span" color={postDetailColor} fontWeight="bold">
            {`r/${subreddit}`}
          </Text>
          {' '}
          <Text as="span" color={postDetailColor}>
            {`Posted by `}
          </Text>
          <Text as="span">u/{author}</Text>
          <Text as="span" color={postDetailColor}>
            {' '}
            <Tooltip label={moment(createdAt).format('LLLL')}>
              {moment(createdAt).fromNow()}
            </Tooltip>
          </Text>
          <Heading mt={2} mb={4} fontSize="1.5em" fontWeight="500">
            {title}
          </Heading>
          <Text>
            {body}
          </Text>
          <Flex mt={3} alignItems="center" color={postDetailColor} fontWeight="bold">
            <Box p={2} borderRadius="sm" _hover={{ backgroundColor: postDetailBgColor }}>
              <ChatIcon mr={2} />
              {numComments} comments
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ThemedBox>
  );
}

export default Post;