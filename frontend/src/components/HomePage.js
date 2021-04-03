import { useState, useEffect } from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import PostList from './PostList';
import axios from '../config/axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('/posts');
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <Flex justify='center'>
      <PostList posts={posts} />
    </Flex>
  );
};

export default HomePage;