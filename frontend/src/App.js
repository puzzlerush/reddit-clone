import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import theme from './theme';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/Navbar';
import CommentsPage from './components/CommentsPage';
import LoginPage from './components/LoginPage';
import ThemedBox from './components/ThemedBox';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <ThemedBox minHeight="100vh" light="gray.300" dark="gray.800">
          <Navbar />
          <Flex justifyContent="center">
            <Box width={['95%', '80%', '70%', '60%']} mb={10}>
              <Switch>
                <Route path="/comments/:id">
                  <CommentsPage />
                </Route>
                <PublicRoute path="/login">
                  <LoginPage />
                </PublicRoute>
              </Switch>
            </Box>
          </Flex>
        </ThemedBox>
      </Router>
    </ChakraProvider>
  );
}

export default App;
