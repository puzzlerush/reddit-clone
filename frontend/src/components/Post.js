import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Collapse, IconButton
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import withTheme from './withTheme';

const Post = ({ bgColor, color, post }) => {
  const [showBody, setShowBody] = useState(false);
  return (
    <Box
      bgColor={bgColor}
      color={color}
      w={['100vw', '80vw', '60vw', '50vw']}
      p={2}
      borderRadius={5}
    >
      <Flex>
        <Text
          isTruncated
          as={post.type === 'text' ? Link : 'a'}
          to={`/posts/${post.id}`}
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
          {post.body}
        </Collapse>
      )}
    </Box>
  );
};

export default withTheme(Post);