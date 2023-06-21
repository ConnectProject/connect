/* eslint-disable react/forbid-prop-types */

import { CardActions, CircularProgress } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import oauthService from '../../services/oauth-service';
import UserService from '../../services/user-service';
import LoginActions from '../../component/LoginActions';

const styles = {
  card: {
    width: 545,
    maxWidth: '100%',
    margin: '0 auto',
    'margin-top': '5%',
  },
  progress: {
    margin: '0 auto',
  },
  buttonContainer: {
    'justify-content': 'center',
  },
};

const OAuthAuthorizePage = function ({ classes }) {

  const [applicationError, setApplicationError] = useState(null);
  const [authorizationError, setAuthorizationError] = useState(false);
  const [application, setApplication] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const params = Object.fromEntries(urlParams);

    Promise.all([
      oauthService.getOAuthApplication({
        clientId: params.client_id,
        redirectUri: params.redirect_uri
      }),
      UserService.getCurrentUserAsync(),
    ])
      // eslint-disable-next-line no-shadow
      .then(([application, currentUser]) => {
        console.log({ application, currentUser });

        let error;
        switch (params.response_type) {
          case 'code':
            break;
          case 'token':
            if (!application.allowImplicitGrant)
              error = new Error('Implicit grant not allowed for this application');
            break;
          default:
            error = new Error('Invalid response_type parameter');
        }
        if (error) {
          setLoading(false);
          setApplicationError(error);

          return;
        }

        setApplicationError(null);
        setApplication(application);
        setCurrentUser(currentUser);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 141) {
          setLoading(false);
          setApplicationError(err);
        } else {
          history.push('/');
        }
      });
  }, []);

  // eslint-disable-next-line no-shadow
  const onUserLoggedIn = function (currentUser) {
    setCurrentUser(currentUser);
  };

  const confirmAuthorization = async function () {
    const params = Object.fromEntries(urlParams);
    try {
      window.location.href = await oauthService.authorize(params);
    } catch (err) {
      console.log({ err });
      setAuthorizationError(true);
    };
  };


  return (
    <Card className={classes.card}>
      <CardContent>
        {loading && (
          <div
            style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
          >
            <CircularProgress className={classes.progress} />
          </div>
        )}
        {!loading && applicationError && (
          <Typography color="error">
            {applicationError.message}. If you are the developer, please
            ensure your OAuth flow is setup correctly.
          </Typography>
        )}
        {!loading && application && (
          <>
            <Typography gutterBottom variant="h4" component="h1">
              Connect
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              {application.name}
            </Typography>
            <Typography
              gutterBottom
              variant="body1"
              color="textPrimary"
              paragraph
            >
              {application.name} would like to send data to Connect in your
              name. They will not have access to private data regarding your
              Connect account. You will be able to revoke this access any time
              from your Connect dashboard.
            </Typography>
            {currentUser ? (
              <>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                >
                  By clicking on &quot;Connect&quot;, you authorize{' '}
                  {application.name} to send data in your name to the Connect
                  system.
                </Typography>
                <CardActions>
                  <Button
                    size="large"
                    color="primary"
                    onClick={() => confirmAuthorization()}
                  >
                    Connect to {application.name}
                  </Button>
                </CardActions>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                >
                  You must log in using your Connect account in order to link
                  it to {application.name}. If you do not have a Connect
                  account yet, you can create it directly from here.
                </Typography>
                <LoginActions
                  onUserLoggedIn={(user) => onUserLoggedIn(user)}
                  redirectPath={`/authorize?${urlParams.toString()}`}
                />
              </>
            )}
          </>
        )}
        {!loading && authorizationError && (
          <Typography color="error">
            Authorization could not be completed, please try again later. If
            you&apos;re the app&apos;s developer, you might want to double
            check your integration.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

OAuthAuthorizePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(OAuthAuthorizePage);
