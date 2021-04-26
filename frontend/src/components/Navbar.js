import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Heading,
  Spacer,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ThemedBox from './ThemedBox';
import { userSelector } from '../selectors';
import { startLogout } from '../actions/auth';

const Navbar = ({ user, startLogout }) => {
  let history = useHistory();
  return (
    <ThemedBox
      py={2}
      px={[5, 5, 10, 10]}
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      mb={7}
    >
      <Heading mx={4} fontSize={['1.5rem', '2.25rem']}>
        weddit
      </Heading>
      <HStack display={['none', 'flex']}>
        <Button as={Link} to="/">
          Home
        </Button>
        <Button as={Link} to="/submit">
          Submit
        </Button>
      </HStack>
      <Spacer />
      <HStack>
        {user ? (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {user.username}
            </MenuButton>
            <MenuList>
              <Box display={['block', 'none']}>
                <MenuItem as={Link} to="/">
                  Home
                </MenuItem>
                <MenuItem as={Link} to="/submit">
                  Submit
                </MenuItem>
                <MenuDivider />
              </Box>
              <MenuItem>My Account</MenuItem>
              <MenuItem
                onClick={async () => {
                  await startLogout();
                  history.push('/');
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button as={Link} to="/login">
              Login
            </Button>
            <Button>Register</Button>
          </>
        )}
      </HStack>
      <ColorModeSwitcher />
    </ThemedBox>
  );
};
const mapStateToProps = (state) => ({
  user: userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
