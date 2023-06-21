import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginPage from '../pages/login/login';
import HomePage from '../pages/home/home';
import OAuthAuthorizePage from '../pages/oauth/authorize';
import DetailsPage from '../pages/details/details';
import ProfilePage from '../pages/profile/profile';
import NoFound404Page from '../pages/notfound/notfound';
import Github from '../pages/login/github';

const Routes = function () {
  return (
    <Switch>
      <Route exact path="/login/github">
        <Github />
      </Route>

      <Route exact path="/application/:appId">
        <DetailsPage />
      </Route>

      <Route exact path="/profile">
        <ProfilePage />
      </Route>

      <Route exact path="/home">
        <HomePage />
      </Route>

      <Route exact path="/authorize">
        <OAuthAuthorizePage />
      </Route>

      <Route exact path="/">
        <LoginPage />
      </Route>

      <Route>
        <NoFound404Page />
      </Route>
    </Switch>
  );
};

export default Routes;
