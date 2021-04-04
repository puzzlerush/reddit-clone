import { Stack } from '@chakra-ui/react';
import Post from './Post';

const PostList = ({ posts }) => {
  const postsToDisplay = posts.map((post) => <Post key={post.id} post={post} />);

  return (
    <Stack spacing={5} mb={10}>
      {postsToDisplay}
    </Stack>
  );
}

export default PostList;