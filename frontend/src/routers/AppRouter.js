import { Box, useColorMode } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';

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
        </Switch>
      </BrowserRouter>
    </Box>

  );
}

export default AppRouter;