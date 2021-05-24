/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import Parse from 'parse';

class Github extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);

    Parse.Cloud.run('get-github-auth-data', {
      code: params.get('code'),
    })
      .then((authData) => {
        Parse.User.logInWith('github', { authData });
      })
      .then(() => {
        history.push('/');
      })
      .catch((err) => {
        console.error(err);
        history.push('/home');
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
