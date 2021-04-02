import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginPage from '../components/LoginPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path='/' exact>
          <div>Home</div>
        </Route>
        <Route path='/login'>
          <LoginPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default AppRouter;