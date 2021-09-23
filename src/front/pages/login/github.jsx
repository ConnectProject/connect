/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types'; // ES6
import * as React from 'react';
import UserService from '../../services/user-service';

class Github extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);

    UserService.confirmGithubAuth({ code: params.get('code') })
      .then(() => {
        if (params.get('redirectPath')) {
          history.push(params.get('redirectPath'));
        } else {
          history.push('/home');
        }
      })
      .catch((err) => {
        console.error(err);
        history.push('/');
      });
  }

  render() {
    return <p>Redirecting...</p>;
  }
}

Github.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Github;
