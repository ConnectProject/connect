import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginPage from '../pages/login/login';
import HomePage from '../pages/home/home';
import OAuthAuthorizePage from '../pages/oauth/authorize';
import DetailsPage from '../pages/details/details';
import ProfilePage from '../pages/profile/profile';
import NoFound404Page from '../pages/notfound/notfound';
import Github from '../pages/login/github';

class Routes extends React.PureComponent {
  render () {
    return (
      <Switch>
        <Route exact path="/login/github" component={Github} />

        <Route exact path="/application/:appId" component={DetailsPage} />

        <Route exact path="/profile" component={ProfilePage} />

        <Route exact path="/home" component={HomePage} />

        <Route exact path="/authorize" component={OAuthAuthorizePage} />

        <Route exact path="/" component={LoginPage} />

        <Route component={NoFound404Page} />
      </Switch>
    );
  }
}

export default Routes;
