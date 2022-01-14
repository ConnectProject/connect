/* eslint-disable react/forbid-prop-types */

import { CardActions, CircularProgress } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6
import * as React from 'react';
import { withRouter } from 'react-router-dom';
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

class OAuthAuthorizePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applicationError: false,
      authorizationError: false,
      application: null,
      currentUser: null,
      loading: true,
    };
    this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
    this.confirmAuthorization = this.confirmAuthorization.bind(this);
  }

  componentDidMount () {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);

    Promise.all([
      oauthService.getOAuthApplication({
        clientId: params.get('client_id'),
        redirectUri: params.get('redirect_uri'),
      }),
      UserService.getCurrentUserAsync(),
    ])
      .then(([application, currentUser]) => {
        console.log({ application, currentUser });
        if (!application) {
          this.setState({
            loading: false,
            applicationError: true,
          });

          return;
        }

        this.setState({
          applicationError: false,
          application,
          currentUser,
          loading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        history.push('/');
      });
  }

  onUserLoggedIn (currentUser) {
    this.setState({ currentUser });
  }

  confirmAuthorization () {
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    oauthService
      .grantAccess({
        clientId: params.get('client_id'),
        redirectUri: params.get('redirect_uri'),
      })
      .then((authorizationCode) => {
        const url = new URL(authorizationCode.redirectUri);
        url.searchParams.set(
          'code',
          authorizationCode.authorizationCode,
        );
        if (params.get('state')) {
          url.searchParams.set(
            'state',
            params.get('state')
          );
        }
        window.location.href = url.href;
      })
      .catch((err) => {
        console.log({ err });
        this.setState({ authorizationError: true });
      });
  }

  render () {
    const { classes } = this.props;
    const {
      loading,
      application,
      applicationError,
      currentUser,
      authorizationError,
    } = this.state;
    const { location } = this.props;
    const params = new URLSearchParams(location.search);

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
              Application could not be found. If you are the developer, please
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
                      onClick={this.confirmAuthorization}
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
                    onUserLoggedIn={this.onUserLoggedIn}
                    redirectPath={`/authorize?${params.toString()}`}
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
  }
}

OAuthAuthorizePage.propTypes = {
  location: PropTypes.object.isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(OAuthAuthorizePage));
