import { useColorMode } from '@chakra-ui/react';

const withTheme = (WrappedComponent) => {
  return (props) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.50', dark: 'gray.600' };
    const textColor = { light: 'black', dark: 'gray.100' };
    return (
      <WrappedComponent
        {...props}
        bgColor={bgColor[colorMode]}
        color={textColor[colorMode]}
      />
    );
  };
};

export default withTheme;