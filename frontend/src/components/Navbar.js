import { Heading, Spacer, HStack, Button } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ThemedBox from './ThemedBox';

const Navbar = () => (
  <ThemedBox
    py={2}
    px={50}
    display="flex"
    justifyContent="flex-start"
    alignItems="center"
    mb={7}
  >
    <Heading
      mx={4}
      display={['none', 'block']}
    >
      weddit
    </Heading>
    <Button>Home</Button>
    <Spacer />
    <HStack>
      <Button>Login</Button>
      <Button>Register</Button>
    </HStack>
    <ColorModeSwitcher />
  </ThemedBox>
);

export default Navbar;