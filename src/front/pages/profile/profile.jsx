import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PropTypes from 'prop-types'; // ES6

import { deleteUser } from '../../services/api';
import { getUser } from '../../services/auth';

const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    'margin-top': 16,
  },
  progress: {
    margin: '0 auto',
    'margin-top': 140,
  },
  listContainer: {
    width: '100%',
  },
  textField: {
    margin: 16,
  },
  button: {
    margin: 8,
    width: 180,
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    'justify-content': 'flex-end',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: 0,
    position: 'relative',
  },
  nameContainer: {
    display: 'flex',
    width: '100%',
  },
};

class ProfilePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: {},
      dialogOpen: false,
    };
  }

  componentDidMount() {
    const user = getUser();
    this.setState({
      loading: false,
      user,
    });
  }

  async handleClose(userToBeDeleted) {
    if (userToBeDeleted) {
      await deleteUser();
      const { history } = this.props;
      history.push('/');
    } else {
      this.setState({
        dialogOpen: false,
      });
    }
  }

  confirmationDialog() {
    this.setState({
      dialogOpen: true,
    });
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { classes } = this.props;
    const { user, loading, dialogOpen } = this.state;

    return (
      <>
        <div className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading && (
            <>
              <div className={classes.nameContainer}>
                <TextField
                  id="name"
                  disabled
                  label="Full Name"
                  className={classes.textField}
                  fullWidth
                  value={user.name}
                  onChange={(event) => this.handleChange('name', event)}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  id="githubLogin"
                  disabled
                  label="GitHub Username"
                  className={classes.textField}
                  fullWidth
                  value={user.login}
                  onChange={(event) => this.handleChange('githubLogin', event)}
                  margin="normal"
                  variant="outlined"
                />
              </div>

              <div className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => this.confirmationDialog()}
                >
                  Delete Profile
                </Button>
              </div>
            </>
          )}
        </div>

        <Dialog open={dialogOpen} onClose={() => this.handleClose(false)}>
          <DialogTitle>Delete your profile?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your profile will be deleted forever and your applications will
              stop working.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose(true)} color="secondary">
              Delete
            </Button>
            <Button
              onClick={() => this.handleClose(false)}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(ProfilePage));
