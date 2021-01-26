/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

import { setAuthToken } from '../../services/auth';

class Github extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);

    const responses = await fetch(`${window._env_.PUBLIC_URL}/api/auth`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ code: params.get('code') }),
    });

    if ((await responses.status) !== 200) {
      return history.push('/');
    }

    setAuthToken(await responses.text());

    return history.push('/home');
  }

  render() {
    return <p>Redirection</p>;
  }
}

Github.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Github;
