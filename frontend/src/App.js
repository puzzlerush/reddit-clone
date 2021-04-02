import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import AppRouter from './routers/AppRouter';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppRouter />
    </ChakraProvider>
  );
}

export default App;
