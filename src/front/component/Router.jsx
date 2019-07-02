import * as React from 'react';
import { Route } from 'react-router-dom';

export const ROUTES = {
  HOME: '/',
  LOGIN_GITHUB: '/login/github',
};

const routesConfig = [
  {
    component: ROUTES.HOME,
    path: ROUTES.HOME,
    exact: true,
  },
  {
    component: ROUTES.LOGIN_GITHUB,
    path: ROUTES.LOGIN_GITHUB,
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
