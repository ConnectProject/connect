import * as React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types'; // ES6

import { hasJwt } from '../services/auth';

class Page extends React.PureComponent {
  constructor() {
    super();
    this.state = { redirectToReferrer: false };
  }

  async componentDidMount() {
    const { isPublic } = this.props;
    if (!isPublic && !hasJwt()) {
      this.setState({ redirectToReferrer: true });
    }
  }

  render() {
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }
    const { children } = this.props;

    return <div>{children}</div>;
  }
}

Page.propTypes = {
  isPublic: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default Page;
