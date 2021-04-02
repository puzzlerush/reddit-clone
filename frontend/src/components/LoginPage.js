import React from 'react';
import { connect } from 'react-redux';
import { Flex, Box, Stack, Input, Button, Text } from '@chakra-ui/react';
import axios from '../config/axios';
import { login } from '../actions/auth';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { username, password } = this.state;
    if (prevState.username !== username || prevState.password !== password) {
      this.setState({ message: '' });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { login } = this.props;
    try {
      const response = await axios.post('/users/login', {
        username,
        password,
        message: '',
      });
      login(response.data)

    } catch (e) {
      console.log(e)
      this.setState({ message: 'Incorrect username or password' })
    }
  }

  render() {
    const { username, password, message } = this.state;
    return (
      <Flex justify='center'>
        <Box m={5}>
          <form onSubmit={this.handleSubmit}>
            <Stack spacing={3}>
              <Input
                type="text"
                placeholder="username"
                size="lg"
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="password"
                size="lg"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                required
              />
              <Button type="submit">Submit</Button>
            </Stack>
            <Box p={2}>
              <Text color='red'>{message}</Text>
            </Box>
          </form>
        </Box>
      </Flex>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);