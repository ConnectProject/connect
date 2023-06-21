import React, { useState } from 'react';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import UserService from '../services/user-service';

const styles = {
  buttonContainer: {
    'justify-content': 'center',
  },
};

const LoginActions = function ({ classes, redirectPath, onUserLoggedIn }) {

  const [isDialogSignupOpened, setIsDialogSignupOpened] = useState(false);
  const [isDialogLoginOpened, setIsDialogLoginOpened] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [textMessage, setTextMessage] = useState(null);

  const handleDialogClose = function () {
    setIsDialogSignupOpened(false);
    setIsDialogLoginOpened(false);
    setTextMessage(null);
  };

  const onSubmitForm = async function () {
    let user;
    try {
      if (isDialogLoginOpened) {
        user = await UserService.loginWithEmail({ email, password });
      } else if (isDialogSignupOpened) {
        user = await UserService.registerWithEmail({ email, password });
      }
    } catch (err) {
      console.log('error code:', err.code);
      console.error(err);
      setTextMessage({
        color: 'error',
        text: err.message || 'An error occured.'
      });
    }
    if (onUserLoggedIn) {
      onUserLoggedIn(user);
    }
  };

  const passwordReset = async function () {
    try {
      if (!document.forms[0].email.reportValidity()) {
        return;
      }
      await UserService.resetPassword({ email });
      setTextMessage({
        color: 'textPrimary',
        text: `Password reset link sent to ${email}`
      }
      );
    } catch (err) {
      console.error(err, err.message);
      setTextMessage({
        color: 'error',
        text: err.message || 'An error occured.'
      });
    }
  };


  let githubRedirectUri = process.env.PUBLIC_URL + '/login/github';
  if (redirectPath) {
    githubRedirectUri =
      githubRedirectUri + '?redirectPath=' + encodeURIComponent(redirectPath);
  }
  githubRedirectUri = encodeURIComponent(githubRedirectUri);

  return (
    <>
      <CardActions className={classes.buttonContainer}>
        <Button
          size="large"
          color="primary"
          onClick={() => setIsDialogLoginOpened(true)}
        >
          Login with email
        </Button>
      </CardActions>
      <CardActions className={classes.buttonContainer}>
        <Button
          size="large"
          color="primary"
          onClick={() => setIsDialogSignupOpened(true)}
        >
          Sign up with email
        </Button>
      </CardActions>
      <CardActions className={classes.buttonContainer}>
        <Button
          size="large"
          color="primary"
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUri}`}
        >
          Login with Github
        </Button>
      </CardActions>
      <Dialog
        open={isDialogSignupOpened || isDialogLoginOpened}
        onClose={() => handleDialogClose}
        aria-labelledby="form-dialog-title"
      >

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitForm();
          }}
        >
          <DialogTitle id="form-dialog-title">
            {isDialogLoginOpened ? 'Login' : 'Sign up'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your email and password.
            </DialogContentText>
            <TextField
              autoFocus
              required
              id="email"
              label="Email"
              className={classes.textField}
              fullWidth
              value={email}
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              margin="normal"
              variant="outlined"
            />

            <TextField
              required
              id="password"
              label="Password"
              className={classes.textField}
              fullWidth
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              margin="normal"
              variant="outlined"
              type="password"
            />
            {textMessage && (
              <DialogContentText align="right" color={textMessage.color}>
                {textMessage.text}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose()} color="primary">
              Cancel
            </Button>
            {isDialogLoginOpened &&
              <Button
                disabled={email.length === 0}
                onClick={() => passwordReset()} color="primary"
              >
                Reset password
              </Button>}
            <Button
              disabled={email.length === 0 || password.length === 0}
              type="submit"
              color="primary"
            >
              {isDialogLoginOpened ? 'Login' : 'Sign up'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

LoginActions.defaultProps = {
  redirectPath: null,
};

LoginActions.propTypes = {
  onUserLoggedIn: PropTypes.func.isRequired,
  redirectPath: PropTypes.string,
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(LoginActions);
