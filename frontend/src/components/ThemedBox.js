import { Box, useColorMode } from '@chakra-ui/react';

const ThemedBox = ({ light = 'white', dark = 'gray.500', children, ...rest }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      backgroundColor={colorMode === 'light' ? light : dark}
      {...rest}
    >
      {children}
    </Box>
  );
}

export default ThemedBox;