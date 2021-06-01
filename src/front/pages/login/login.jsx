import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6

import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserService from '../../services/user-service';

const styles = {
  card: {
    maxWidth: 345,
    margin: '0 auto',
    'margin-top': '10%',
  },
  media: {
    height: 140,
  },
  buttonContainer: {
    'justify-content': 'center',
  },
};

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDialogSignupOpened: false,
      isDialogLoginOpened: false,
      email: '',
      password: '',
    };
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  componentDidMount() {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      const { history } = this.props;
      history.push('/home');
    }
  }

  handleDialogClose() {
    this.setState({
      isDialogSignupOpened: false,
      isDialogLoginOpened: false,
    });
  }

  async onSubmitForm() {
    const {
      isDialogLoginOpened,
      isDialogSignupOpened,
      email,
      password,
    } = this.state;
    let user;
    try {
      if (isDialogLoginOpened) {
        user = await UserService.loginWithEmail({ email, password });
      } else if (isDialogSignupOpened) {
        user = await UserService.registerWithEmail({ email, password });
      }
    } catch (err) {
      console.error(err, err.message);
    }
    if (user) {
      const { history } = this.props;
      history.push('/home');
    }
  }

  render() {
    const { classes } = this.props;
    const {
      isDialogLoginOpened,
      isDialogSignupOpened,
      email,
      password,
    } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          <CardMedia
            className={classes.media}
            image="/image.png"
            title="Connect title"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Welcome
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              To start using Connect, please use your GitHub account to login?
            </Typography>
          </CardContent>
        </CardContent>
        <CardActions className={classes.buttonContainer}>
          <Button
            size="large"
            color="primary"
            onClick={() => this.setState({ isDialogLoginOpened: true })}
          >
            Login
          </Button>
          <Button
            size="large"
            color="primary"
            onClick={() => this.setState({ isDialogSignupOpened: true })}
          >
            SignUp
          </Button>
          <Button
            size="large"
            color="primary"
            href={`https://github.com/login/oauth/authorize?client_id=${window._env_.GITHUB_CLIENT_ID}`}
          >
            Login with Github
          </Button>
        </CardActions>
        <Dialog
          open={isDialogSignupOpened || isDialogLoginOpened}
          onClose={() => this.handleDialogClose}
          aria-labelledby="form-dialog-title"
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
              id="description"
              label="Description"
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDialogClose()} color="primary">
              Cancel
            </Button>
            <Button
              disabled={email.length === 0 || password.length === 0}
              onClick={this.onSubmitForm}
              color="primary"
            >
              {isDialogLoginOpened ? 'Login' : 'Sign up'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(LoginPage));
