import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Collapse, IconButton, Tooltip, Link as ChakraLink
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import moment from 'moment';
import withTheme from './withTheme';

const Post = ({ bgColor, color, post }) => {
  const [showBody, setShowBody] = useState(false);
  const linkToPost = `/posts/${post.id}`;
  return (
    <Box
      bgColor={bgColor}
      color={color}
      w={['100vw', '80vw', '60vw', '50vw']}
      p={2}
      borderRadius={5}
    >
      <Text>
        {`Posted by `}
        <ChakraLink
          as={Link}
          to={`/u/${post.author_name}`}
        >
          {post.author_name}
        </ChakraLink>
        {` `}
        <Tooltip label={moment(post.created_at).format('LLLL')}>
          {moment(post.created_at).fromNow()}
        </Tooltip>
      </Text>
      <Flex>
        <Text
          isTruncated
          as={post.type === 'text' ? Link : 'a'}
          to={linkToPost}
          href={post.body}
          flex={1}
          fontSize='lg'
          fontWeight='bold'
        >
          {post.title}
        </Text>
        {post.type === 'text' && (
          <IconButton
            aria-label='Expand post body'
            icon={showBody ? <MinusIcon /> : <AddIcon />}
            onClick={() => setShowBody(!showBody)}
          />
        )}
      </Flex>
      {post.type === 'text' && (
        <Collapse mt={4} in={showBody}>
          <Text mb={5}>
            {post.body}
          </Text>
        </Collapse>
      )}
      <Flex>
        <ChakraLink as={Link} to={linkToPost}>
          {post.number_of_comments} comments
        </ChakraLink>
      </Flex>
    </Box>
  );
};

export default withTheme(Post);