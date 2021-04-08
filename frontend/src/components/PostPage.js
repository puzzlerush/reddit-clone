import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import axios from '../config/axios';
import Post from './Post';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data);
      } catch (e) {
        setMessage(`Could not get post with id ${id}`);
      }
      setLoading(false);
    };
    fetchPost();
  });

  return (
    <Flex justifyContent='center'>
      {!loading && <Post post={post} defaultShow={true} />}
    </Flex>
  );
};

export default PostPage;