/* eslint-disable complexity */
/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FileCopy from '@material-ui/icons/FileCopy';
import PropTypes from 'prop-types'; // ES6
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';

import { validateFormField, checkValid } from '../../services/formValidator';
import ApplicationsService from '../../services/applications-service';

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
    width: 120,
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
  formControlLabel: {
    marginLeft: 16
  }
};

const DetailsPage = function ({ classes }) {
  const { appId } = useParams();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [application, setApplication] = useState({});
  const [applicationUpdate, setApplicationUpdate] = useState({});
  const [snackBarText, setSnackBarText] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    appleStoreLink: false,
    googleMarketLink: false,
  });

  useEffect(() => {
    ApplicationsService.findById(appId).then((res) => {
      setLoading(false);
      setApplication(res);
    });
  }, [appId]);

  const handleChange = function (name, event) {
    const { value } = event.target;

    const validated = validateFormField(value, name);
    setApplicationUpdate((prevUpdate) => ({
      ...prevUpdate,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validated,
    }));
  };


  const handleToggle = function (name, event) {
    const { checked } = event.target;

    setApplicationUpdate((prevUpdate) => ({
      ...prevUpdate,
      [name]: checked,
    }));
  };

  const handleClose = function (event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarText('');
  };

  const clickUpdateApplication = async function () {
    setUpdateLoading(true);

    Object.entries(applicationUpdate).forEach(([key, value]) => {
      application.set(key, value);
    });
    await application.save();
    setUpdateLoading(false);
    setApplication(application);
    setApplicationUpdate({});
    setSnackBarText("Application successfully updated");
  };

  const copyToClipboard = function (key) {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(
          application.attributes[key] || application[key],
        );
        setSnackBarText("Copied!");
      }
    });
  };

  return (
    <div className={classes.root}>
      {loading && <CircularProgress className={classes.progress} />}

      {!loading && (
        <>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            fullWidth
            value={
              applicationUpdate.name ?? application.attributes.name ?? ''
            }
            onChange={(event) => handleChange('name', event)}
            margin="normal"
            variant="outlined"
            error={errors.name}
          />

          <TextField
            id="description"
            label="Description"
            className={classes.textField}
            fullWidth
            value={
              applicationUpdate.description ??
              application.attributes.description ??
              ''
            }
            onChange={(event) => handleChange('description', event)}
            margin="normal"
            variant="outlined"
            multiline
            minRows={2}
            error={errors.name}
          />

          <TextField
            id="appleStoreLink"
            label="App Store Link"
            className={classes.textField}
            fullWidth
            value={
              applicationUpdate.appleStoreLink ??
              application.attributes.appleStoreLink ??
              ''
            }
            onChange={(event) => handleChange('appleStoreLink', event)}
            margin="normal"
            variant="outlined"
            error={errors.appleStoreLink}
          />

          <TextField
            id="googleMarketLink"
            label="Play Store Link"
            className={classes.textField}
            fullWidth
            value={
              applicationUpdate.googleMarketLink ??
              application.attributes.googleMarketLink ??
              ''
            }
            onChange={(event) =>
              handleChange('googleMarketLink', event)
            }
            margin="normal"
            variant="outlined"
            error={errors.googleMarketLink}
          />

          <TextField
            readOnly
            id="id"
            label="Application ID"
            className={classes.textField}
            fullWidth
            helperText="Used to identify your application within the API"
            value={application.id}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={() => {
                        copyToClipboard('id');
                      }}
                    >
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            readOnly
            id="pub_key"
            label="OAuth Client ID"
            className={classes.textField}
            fullWidth
            helperText="Used to identify your application with the OAuth flow"
            value={application.attributes.publicKey}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={() => {
                        copyToClipboard('publicKey');
                      }}
                    >
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            readOnly
            id="sec_key"
            label="OAuth Secret Key"
            className={classes.textField}
            fullWidth
            helperText="Used to identify your application with the OAuth flow - not to be used on client side applications"
            value={application.attributes.secretKey}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={() => {
                        copyToClipboard('secretKey');
                      }}
                    >
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="redirectUris"
            label="OAuth Redirect URIs"
            className={classes.textField}
            fullWidth
            helperText="Enter URIs your app can receive the OAuth response on. Separate multiple URIs by a coma. Can be a web url or a deeplink uri for mobile apps."
            value={
              applicationUpdate.redirectUris ??
              application.attributes.redirectUris ??
              ''
            }
            onChange={(event) => handleChange('redirectUris', event)}
            margin="normal"
            variant="outlined"
            error={errors.redirectUris}
          />

          <FormControlLabel
            className={classes.formControlLabel}
            sx={{ 'margin-left': '16px' }}
            control={
              <Switch
                color="primary"
                checked={
                  applicationUpdate.allowImplicitGrant ??
                  application.attributes.allowImplicitGrant ??
                  false
                }
                onChange={(event) => handleToggle('allowImplicitGrant', event)}
              />
            }
            label="Allow implicit grant (less secure)"
          />

          <div className={classes.buttonContainer}>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={updateLoading || !checkValid(errors)}
                className={classes.button}
                onClick={() => clickUpdateApplication()}
              >
                Save
              </Button>
              {updateLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </div>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={!!snackBarText}
            autoHideDuration={1000}
            onClose={() => {
              handleClose();
            }}
            message={snackBarText}
          />
        </>
      )}
    </div>
  );
};

DetailsPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(DetailsPage);
