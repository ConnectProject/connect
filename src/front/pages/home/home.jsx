/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'; // ES6

import { hasJwt } from '../../services/auth';


const styles = {
  card: {
    maxWidth: 345,
    margin: "0 auto",
    "margin-top": "10%",
  },
  media: {
    height: 140,
  },
  buttonContainer: {
    "justify-content": "center",
  }
};


class HomePage extends React.PureComponent {
  render() {
    return (
      <p>Coucou</p>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};



export default withRouter(withStyles(styles)(HomePage));
