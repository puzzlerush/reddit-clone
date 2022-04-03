import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import theme from './theme';
import Navbar from './components/Navbar';
import CommentsPage from './pages/CommentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostList from './components/PostList';
import ThemedBox from './components/ThemedBox';
import CreateSubredditPage from './pages/CreateSubredditPage';
import { tokenSelector } from './selectors';

const GoHome = () => <Navigate to="/" replace />;
const Forbidden = () => (
  <Navigate
    to={{
      pathname: '/login',
      state: {
        requireAuth: 'You must be logged in to do that',
        prevPathname: location.pathname,
      },
    }}
    replace
  />
);

const App = () => {
  const token = useSelector(tokenSelector);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <ThemedBox minHeight="100vh" light="gray.300" dark="gray.800">
          <Navbar />
          <Flex justifyContent="center">
            <Box width={['95%', '80%', '70%', '60%']} mb={10}>
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route
                  path="/r/:subreddit/comments/:id"
                  element={<CommentsPage />}
                />
                <Route
                  path="/login"
                  element={token ? <GoHome /> : <LoginPage />}
                />
                <Route
                  path="/register"
                  element={token ? <GoHome /> : <RegisterPage />}
                />
                <Route
                  path="/submit"
                  element={token ? <CreatePostPage /> : <Forbidden />}
                />
                <Route
                  path="/subreddits/create"
                  element={token ? <CreateSubredditPage /> : <Forbidden />}
                />
                <Route path="/r/:subreddit" element={<PostList />} />
              </Routes>
            </Box>
          </Flex>
        </ThemedBox>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
