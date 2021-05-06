import { login, logout } from '../../actions/auth';
import { user, token } from '../fixtures/auth';

it('should create login action', () => {
  const action = login(user, token);
  expect(action).toEqual({
    type: 'LOGIN',
    user,
    token,
  });
});

it('should create logout action', () => {
  expect(logout()).toEqual({
    type: 'LOGOUT',
  });
});
