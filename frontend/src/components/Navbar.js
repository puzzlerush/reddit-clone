import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Heading,
  Spacer,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ThemedBox from './ThemedBox';
import { userSelector } from '../selectors';

const Navbar = ({ user }) => (
  <ThemedBox
    py={2}
    px={50}
    display="flex"
    justifyContent="flex-start"
    alignItems="center"
    mb={7}
  >
    <Heading mx={4} display={['none', 'block']}>
      weddit
    </Heading>
    <Button>Home</Button>
    <Spacer />
    <HStack>
      {user ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {user.username}
          </MenuButton>
          <MenuList>
            <MenuItem>My Account</MenuItem>
            <MenuItem>Logout </MenuItem>
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

const mapStateToProps = (state) => ({
  user: userSelector(state),
});

export default connect(mapStateToProps)(Navbar);
