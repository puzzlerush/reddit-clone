import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Flex,
  Stack,
  Box,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import withTheme from './withTheme';
import axios from '../config/axios';
import { logout } from '../actions/auth';

const Navbar = ({ user, logout, bgColor, color }) => {
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
      justify='center'
      align='center'
      fontSize={['md', 'lg', 'xl', 'xl']}
      h='60px'
      boxShadow='md'
      p={2}
      marginBottom={5}
      bgColor={bgColor}
      color={color}
    >
      <Flex w={['95vw', '95vw', '80vw', '80vw']} justify='space-around'>
        <Heading as={Link} to='/'>Weddit</Heading>
        <Stack
          direction='row'
        >
          {user ? (
            <Menu>
              <MenuButton as={Button}>
                {user.username}
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem as={Link} to='/submit'>
                    Submit Post
                  </MenuItem>
                  <MenuDivider />
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Navbar));