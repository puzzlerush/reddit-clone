import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  Text,
  Heading,
  Box,
  Flex,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import ThemedBox from './ThemedBox';
import UpvoteBar from './UpvoteBar';

const Post = ({
  id,
  type,
  subreddit,
  author,
  createdAt,
  title,
  body,
  numVotes,
  hasVoted,
  numComments,
}) => {
  const { colorMode } = useColorMode();
  const postDetailColor = 'gray.500';
  const postDetailBgColor = colorMode === 'light' ? 'gray.100' : 'gray.600';
  const isTextPost = type === 'text';
  return (
    <ThemedBox
      p={4}
      borderRadius="md"
      width="100%"
      light="gray.50"
      dark="gray.700"
    >
      <Flex>
        <UpvoteBar
          type="post"
          numVotes={numVotes}
          id={id}
          voteValue={hasVoted}
        />
        <Box>
          <Text as="span" color={postDetailColor} fontWeight="bold">
            {`r/${subreddit}`}
          </Text>{' '}
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
          <Heading
            as={isTextPost ? Link : 'a'}
            display="block"
            to={isTextPost ? `/comments/${id}` : null}
            href={isTextPost ? null : body}
            target={isTextPost ? null : '_blank'}
            mt={2}
            mb={4}
            fontSize="1.5em"
            fontWeight="500"
          >
            {title}
          </Heading>
          {isTextPost && <Text>{body}</Text>}
          <Flex
            mt={3}
            alignItems="center"
            color={postDetailColor}
            fontWeight="bold"
          >
            <Box
              as={Link}
              to={`/comments/${id}`}
              p={2}
              borderRadius="sm"
              _hover={{ backgroundColor: postDetailBgColor }}
            >
              <ChatIcon mr={2} />
              {numComments} comments
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ThemedBox>
  );
};

export default Post;
