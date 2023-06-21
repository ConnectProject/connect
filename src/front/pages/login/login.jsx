import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6

import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import UserService from '../../services/user-service';
import LoginActions from '../../component/LoginActions';

const styles = {
  card: {
    maxWidth: 345,
    margin: '0 auto',
    'margin-top': '10%',
  },
  media: {
    height: 140,
    'background-size': 'contain'
  },
};

const LoginPage = function ({ classes }) {
  const history = useHistory();

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      history.push('/home');
    }
  });

  const onUserLoggedIn = function (user) {
    if (user) {
      history.push('/home');
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <CardMedia
          className={classes.media}
          image="/connect.jpg"
          title="Connect image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Welcome
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            To start using Connect, please use your email or your GitHub account to login.
          </Typography>
        </CardContent>
      </CardContent>
      <LoginActions onUserLoggedIn={(user) => onUserLoggedIn(user)} />
    </Card>
  );

};


LoginPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(LoginPage);
