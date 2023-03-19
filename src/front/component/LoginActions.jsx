import * as React from 'react';
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

class LoginActions extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDialogSignupOpened: false,
      isDialogLoginOpened: false,
      email: '',
      password: '',
      errorMessage: null,
    };

    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.passwordReset = this.passwordReset.bind(this);
  }

  handleDialogClose () {
    this.setState({
      isDialogSignupOpened: false,
      isDialogLoginOpened: false,
      errorMessage: null
    });
  }

  async onSubmitForm () {
    const { isDialogLoginOpened, isDialogSignupOpened, email, password } =
      this.state;
    let user;
    try {
      if (isDialogLoginOpened) {
        user = await UserService.loginWithEmail({ email, password });
      } else if (isDialogSignupOpened) {
        user = await UserService.registerWithEmail({ email, password });
      }
    } catch (err) {
      console.log('error code:', err.code)
      console.error(err);
      this.setState({ errorMessage: err.message || 'An error occured.' });
    }
    const { onUserLoggedIn } = this.props;
    if (onUserLoggedIn) {
      onUserLoggedIn(user);
    }
  }

  async passwordReset () {
    const {email} = this.state
    try {
      await UserService.resetPassword({email})
    } catch (err) {
      console.error(err, err.message);
      this.setState({ errorMessage: err.message || 'An error occured.' });
    }
  }

  render () {
    const { classes, redirectPath } = this.props;
    const {
      isDialogLoginOpened,
      isDialogSignupOpened,
      email,
      password,
      errorMessage,
    } = this.state;

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
            onClick={() => this.setState({ isDialogLoginOpened: true })}
          >
            Login with email
          </Button>
        </CardActions>
        <CardActions className={classes.buttonContainer}>
          <Button
            size="large"
            color="primary"
            onClick={() => this.setState({ isDialogSignupOpened: true })}
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
          onClose={() => this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >

<form
            onSubmit={(e) => {
              e.preventDefault();
              this.onSubmitForm();
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
              onChange={(event) => this.setState({ email: event.target.value })}
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
                this.setState({ password: event.target.value })
              }
              margin="normal"
              variant="outlined"
              type="password"
            />
            {errorMessage && (
              <DialogContentText align="right" color="error">
                {errorMessage}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            {isDialogLoginOpened &&
            <Button
              disabled={email.length === 0}
              onClick={this.passwordReset}color="primary"
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
  }
}

LoginActions.defaultProps = {
  redirectPath: null,
};

LoginActions.propTypes = {
  onUserLoggedIn: PropTypes.func.isRequired,
  redirectPath: PropTypes.string,
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(LoginActions);
