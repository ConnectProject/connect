import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginPage from '../pages/login/login';
import HomePage from '../pages/home/home';
import DetailsPage from '../pages/details/details';
import ProfilePage from '../pages/profile/profile';
import NoFound404Page from '../pages/notfound/notfound';
import Github from '../pages/login/github';

// not used anywhere
// export const ROUTES = {
//   HOME: '/',
//   LOGIN_GITHUB: '/login/github',
//   CONNECTED_HOME: '/home',
// };

class Routes extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path="/login/github" component={Github} />

        <Route exact path="/application/:appId" component={DetailsPage} />

        <Route exact path="/profile" component={ProfilePage} />

        <Route exact path="/home" component={HomePage} />

        <Route exact path="/" component={LoginPage} />

        <Route component={NoFound404Page} />
      </Switch>
    );
  }
}

export default Routes;
