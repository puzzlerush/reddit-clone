import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Flex,
  Stack,
  Box,
  Heading,
  Button,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import axios from '../config/axios';
import { logout } from '../actions/auth';

const Navbar = ({ user, logout }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.300', dark: 'gray.600' };
  const textColor = { light: 'black', dark: 'gray.100' };

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      logout();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex
      w='100vw'
      bg={bgColor[colorMode]}
      color={textColor[colorMode]}
      justify='center'
      align='center'
      fontSize={['md', 'lg', 'xl', 'xl']}
      h='60px'
      boxShadow='md'
      p={2}
    >
      <Flex w={['100vw', '100vw', '80vw', '80vw']} justify='space-around'>
        <Heading as={Link} to='/'>Weddit</Heading>
        <Stack
          direction='row'
        >
          <Button>Create Post</Button>
          {user ? (
            <Menu>
              <MenuButton as={Button}>
                {user.username}
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem>My Account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          ) : (
            <Button as={Link} to='/login'>Login</Button>
          )}
        </Stack>
      </Flex>
      <Box>
        <ColorModeSwitcher />
      </Box>
    </Flex>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);