/* eslint-disable max-lines */

import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import withStyles from '@mui/styles/withStyles';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types'; // ES6
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FileCopy from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
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

const ProfilePage = function ({ classes }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [grantedTokens, setGrantedTokens] = useState([]);
  const [tokenToRevokeInDialog, setTokenToRevokeInDialog] = useState(null);

  const user = UserService.getCurrentUser();

  const handleClose = async function (userToBeDeleted) {
    if (userToBeDeleted) {
      await UserService.deleteCurrentUser();
      const navigate = useNavigate();
      navigate('/');
    } else {
      setDialogOpen(false);
    }
  };

  const handleCloseSnackbar = function (event, reason) {
    if (reason !== 'clickaway') {
      setSnackBarOpen(false);
    }
  };

  const copyToClipboard = function () {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(user.getSessionToken());
        setSnackBarOpen(true);
      }
    });
  };

  const refreshGrantedTokens = async function () {
    const tokens = await UserTokensManagementService.getGrantedTokens();
    setGrantedTokens(tokens || []);
  };

  const deleteToken = async function () {
    await UserTokensManagementService.revokeToken({
      tokenId: tokenToRevokeInDialog.id,
    });
    setTokenToRevokeInDialog(null);
    await refreshGrantedTokens();
  };

  useEffect(() => {
    refreshGrantedTokens();
  }, []);

  return <>
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
                  <IconButton onClick={() => copyToClipboard()} size="large">
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
          onClick={() => setDialogOpen(true)}
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
                    setTokenToRevokeInDialog(token)
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

    <Dialog open={dialogOpen} onClose={() => handleClose(false)}>
      <DialogTitle>Delete your profile?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your profile will be deleted forever and your applications will
          stop working.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)} color="secondary">
          Delete
        </Button>
        <Button
          onClick={() => handleClose(false)}
          color="primary"
          autoFocus
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={!!tokenToRevokeInDialog}
      onClose={() => setTokenToRevokeInDialog(null)}
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
          onClick={() => setTokenToRevokeInDialog(null)}
          color="primary"
          autoFocus
        >
          Cancel
        </Button>
        <Button onClick={() => deleteToken()} color="secondary">
          Revoke access from {tokenToRevokeInDialog?.application.name}
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackBarOpen}
      autoHideDuration={1000}
      onClose={(event, reason) => handleCloseSnackbar(event, reason)}
      message={<span>Copied!</span>}
    />
  </>;
};

ProfilePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(ProfilePage);
