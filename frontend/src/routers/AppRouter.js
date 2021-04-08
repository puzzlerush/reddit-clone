import { Box, useColorMode } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import CreatePostPage from '../components/CreatePostPage';
import PostPage from '../components/PostPage';

const AppRouter = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.300', dark: 'gray.800' };
  console.log(colorMode)
  return (
    <Box minHeight='100vh' bgColor={bgColor[colorMode]}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/login'>
            <LoginPage />
          </Route>
          <Route path='/posts/:id'>
            <PostPage />
          </Route>
          <PrivateRoute path='/submit'>
            <CreatePostPage />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </Box>

  );
}

export default AppRouter;