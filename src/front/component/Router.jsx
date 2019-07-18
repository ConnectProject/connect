import * as React from 'react';
import { Route } from 'react-router-dom';

export const ROUTES = {
  HOME: '/',
  LOGIN_GITHUB: '/login/github',
  CONNECTED_HOME: '/home'
};

const routesConfig = [
  {
    component: '/',
    path: '/',
    exact: true,
  },
  {
    component: 'login/github',
    path: '/login/github',
    exact: true,
  },
  {
    component: 'home/home',
    path: '/home',
    exact: true,
  },

];

class Routes extends React.Component {
  render() {
    return (
      <>
        {routesConfig.map((route, i) => {
          const path =
            route.component.charAt(0) === '/'
              ? route.component.substr(1)
              : route.component;
          const component = require(`./../pages/${path}`).default;
          return (
            <Route
              exact={route.exact}
              path={route.path}
              component={component}
              key={i}
            />
          );
        })}
      </>
    );
  }
}

export default Routes;
