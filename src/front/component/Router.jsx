import * as React from 'react';
import { Route } from 'react-router-dom';

import LoginPage from '../pages/login/login';
import Github from '../pages/login/github';
import HomePage from '../pages/home/home';

export const ROUTES = {
  HOME: '/',
  LOGIN_GITHUB: '/login/github',
  CONNECTED_HOME: '/home'
};

class Routes extends React.PureComponent {
  render() {
    return (
      <>
        <Route
          exact
          path='/login/github'
          component={Github}
        />

        <Route
          exact
          path='/home'
          component={HomePage}
        />


        <Route
          exact
          path='/'
          component={LoginPage}
        />



      </>
    );
  }
}

export default Routes;
