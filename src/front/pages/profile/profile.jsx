/* eslint-disable max-lines */

import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types'; // ES6
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import UserTokensManagementService from '../../services/user-tokens-management-service';
import UserService from '../../services/user-service';

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
      user: UserService.getCurrentUser(),
      dialogOpen: false,
      snackBarOpen: false,
      grantedTokens: [],
      tokenToRevokeInDialog: null,
    };
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    this.refreshGrantedTokens = this.refreshGrantedTokens.bind(this);
    this.deleteToken = this.deleteToken.bind(this);
  }

  componentDidMount () {
    this.refreshGrantedTokens();
  }

  async handleClose (userToBeDeleted) {
    if (userToBeDeleted) {
      await UserService.deleteCurrentUser();
      const { history } = this.props;
      history.push('/');
    } else {
      this.setState({ dialogOpen: false });
    }
  }

  handleCloseSnackbar (event, reason) {
    if (reason !== 'clickaway') {
      this.setState({ snackBarOpen: false });
    }
  }

  copyToClipboard () {
    const { user } = this.state;
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(user.getSessionToken());
        this.setState({ snackBarOpen: true });
      }
    });
  }

  goBack () {
    const { history } = this.props;
    history.goBack();
  }

  async refreshGrantedTokens () {
    const tokens = await UserTokensManagementService.getGrantedTokens();
    this.setState({ grantedTokens: tokens || [] });
  }

  async deleteToken () {
    const { tokenToRevokeInDialog } = this.state;
    await UserTokensManagementService.revokeToken({
      tokenId: tokenToRevokeInDialog.id,
    });
    this.setState({ tokenToRevokeInDialog: null });
    await this.refreshGrantedTokens();
  }

  render () {
    const { classes } = this.props;
    const {
      user,
      dialogOpen,
      snackBarOpen,
      grantedTokens,
      tokenToRevokeInDialog,
    } = this.state;

    return (
      <>
        <div className={classes.root}>
          <div className={classes.nameContainer}>
            <TextField
              id="name"
              readOnly
              label="Username"
              className={classes.textField}
              fullWidth
              value={user.get('username')}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className={classes.nameContainer}>
            <TextField
              id="sessionToken"
              readOnly
              label="Session token"
              helperText={
                <>
                  Your personal access token to access the API in read-only
                  mode. See{' '}
                  <a
                    href="https://github.com/ConnectProject/connect/blob/master/docs/usage.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    usage documentation
                  </a>
                  .
                </>
              }
              className={classes.textField}
              fullWidth
              value={user.getSessionToken()}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy to clipboard">
                      <IconButton onClick={this.copyToClipboard}>
                        <FileCopy />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => this.setState({ dialogOpen: true })}
            >
              Delete Profile
            </Button>
          </div>
        </div>

        {grantedTokens.length > 0 && (
          <div className={classes.root}>
            <Typography variant="h3" component="h5">
              Apps you granted access to
            </Typography>
            <List className={classes.root}>
              {grantedTokens.map((token) => (
                <div key={token.id} className={classes.listContainer}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      flex={1}
                      primary={
                        <>
                          {token.application.name}
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {' — access granted on '}
                            <Moment format="YYYY-MM-DD HH:mm">
                              {token.grantedAt}
                            </Moment>
                          </Typography>
                        </>
                      }
                      secondary={token.application.description}
                    />
                    <Button
                      onClick={() =>
                        this.setState({ tokenToRevokeInDialog: token })
                      }
                      color="secondary"
                    >
                      Revoke
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))}
            </List>
          </div>
        )}

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

        <Dialog
          open={!!tokenToRevokeInDialog}
          onClose={() => this.setState({ tokenToRevokeInDialog: null })}
        >
          <DialogTitle>
            Remove access from {tokenToRevokeInDialog?.application.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The app {tokenToRevokeInDialog?.application.name} will not be able
              to send data in your name to Connect anymore. Previously sent data
              will not be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ tokenToRevokeInDialog: null })}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
            <Button onClick={this.deleteToken} color="secondary">
              Revoke access from {tokenToRevokeInDialog?.application.name}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackBarOpen}
          autoHideDuration={1000}
          onClose={this.handleCloseSnackbar}
          message={<span>Copied!</span>}
        />
      </>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(ProfilePage));
