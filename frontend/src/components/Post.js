import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Collapse, IconButton, Tooltip, Link as ChakraLink
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import moment from 'moment';
import withTheme from './withTheme';

const Post = ({ bgColor, color, post, defaultShow = false }) => {
  const [showBody, setShowBody] = useState(defaultShow);
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
        <Box flex={1} mt={2} mb={2}>
          <Text
            isTruncated
            as={post.type === 'text' ? Link : 'a'}
            to={linkToPost}
            target={post.type === 'text' ? null : '_blank'}
            href={post.body}
            fontSize='lg'
            fontWeight='bold'
          >
            {post.title}
          </Text>
        </Box>

        {post.type === 'text' && (
          <IconButton
            aria-label='Expand post body'
            icon={showBody ? <MinusIcon /> : <AddIcon />}
            onClick={() => setShowBody(!showBody)}
          />
        )}
      </Flex>
      {post.type === 'text' && (
        <Collapse in={showBody}>
          <Text border='1px' borderRadius='5px' p={2} m={2} borderColor='gray.400'>
            {post.body}
          </Text>
        </Collapse>
      )}
      <Flex mt={2}>
        <ChakraLink as={Link} to={linkToPost}>
          {post.number_of_comments} comments
        </ChakraLink>
      </Flex>
    </Box>
  );
};

export default withTheme(Post);