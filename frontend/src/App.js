import React from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  theme,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import CommentsPage from './components/CommentsPage';
import ThemedBox from './components/ThemedBox';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ThemedBox
        minHeight="100vh"
        light="gray.300"
        dark="gray.800"
      >
        <Navbar />
        <Flex justifyContent="center">
          <Box width={['95%', '80%', '70%', '60%']} mb={10}>
            <CommentsPage />
          </Box>
        </Flex>
      </ThemedBox>
    </ChakraProvider>
  );
}

export default App;
