import * as React from 'react';
import { Redirect } from 'react-router';
import { ROUTES } from './Router';
import { hasJwt } from '../services/auth';

class Page extends React.Component {
  state = { redirectToReferrer: false };

  async componentDidMount() {
    if (!this.props.isPublic && !hasJwt()) {
      this.setState({ redirectToReferrer: true });
    }
  }

  render() {
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={ROUTES.HOME} />;
    }

    return <div>{this.props.children}</div>;
  }
}

export default Page;
