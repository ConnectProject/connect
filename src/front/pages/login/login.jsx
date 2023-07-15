import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types'; // ES6

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      navigate('/home');
    }
  });

  const onUserLoggedIn = function (user) {
    if (user) {
      navigate('/home');
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
