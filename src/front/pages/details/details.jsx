/* eslint-disable max-lines */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopy';
import PropTypes from 'prop-types'; // ES6
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';

import Parse from 'parse';
import { validateFormField, checkValid } from '../../services/formValidator';

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
};

class DetailsPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      updateLoading: false,
      application: {},
      applicationUpdate: {},
      snackBarOpen: false,
      errors: {
        name: false,
        description: false,
        appleStoreLink: false,
        googleMarketLink: false,
      },
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const Application = Parse.Object.extend('OAuthApplication');
    const query = new Parse.Query(Application);
    query.get(match.params.appId).then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        loading: false,
        application: res,
      }));
    });
  }

  handleChange(name, event) {
    const { applicationUpdate, errors } = this.state;
    const { value } = event.target;

    const validated = validateFormField(value, name);
    this.setState({
      applicationUpdate: {
        ...applicationUpdate,
        [name]: value,
      },
      errors: {
        ...errors,
        [name]: !validated,
      },
    });
  }

  handleClick() {
    this.setState({
      snackBarOpen: true,
    });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackBarOpen: false,
    });
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  async clickUpdateApplication() {
    const { application, applicationUpdate } = this.state;
    this.setState({
      updateLoading: true,
    });

    Object.entries(applicationUpdate).forEach(([key, value]) => {
      application.set(key, value);
    });
    await application.save();
    this.setState({
      updateLoading: false,
      application,
      applicationUpdate: {},
    });
  }

  copyToClipboard(key) {
    const { application } = this.state;
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(application[key]);
        this.setState({ snackBarOpen: true });
      }
    });
  }

  render() {
    const { classes } = this.props;
    const {
      application,
      applicationUpdate,
      errors,
      loading,
      updateLoading,
      snackBarOpen,
    } = this.state;

    return (
      <>
        <div className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading && (
            <>
              <TextField
                id="name"
                label="Name"
                className={classes.textField}
                fullWidth
                value={applicationUpdate.name || application.attributes.name}
                onChange={(event) => this.handleChange('name', event)}
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
                  applicationUpdate.description ||
                  application.attributes.description
                }
                onChange={(event) => this.handleChange('description', event)}
                margin="normal"
                variant="outlined"
                multiline
                rows="4"
                error={errors.name}
              />

              <TextField
                id="appleStoreLink"
                label="App Store Link"
                className={classes.textField}
                fullWidth
                value={
                  applicationUpdate.appleStoreLink ||
                  application.attributes.appleStoreLink ||
                  ''
                }
                onChange={(event) => this.handleChange('appleStoreLink', event)}
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
                  applicationUpdate.googleMarketLink ||
                  application.attributes.googleMarketLink ||
                  ''
                }
                onChange={(event) =>
                  this.handleChange('googleMarketLink', event)
                }
                margin="normal"
                variant="outlined"
                error={errors.googleMarketLink}
              />

              <div className={classes.buttonContainer}>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={updateLoading || !checkValid(errors)}
                    className={classes.button}
                    onClick={() => this.clickUpdateApplication()}
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

              <TextField
                disabled
                id="parse_name"
                label="App ID"
                className={classes.textField}
                fullWidth
                helperText="Used to identify your application with the API"
                value={application.parse_name}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          onClick={() => {
                            this.copyToClipboard('parse_name');
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
                disabled
                id="token"
                label="Token"
                className={classes.textField}
                fullWidth
                helperText="Production environment"
                value={application.token}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          onClick={() => {
                            this.copyToClipboard('token');
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
                disabled
                id="token_sandbox"
                label="Token Sandbox"
                className={classes.textField}
                fullWidth
                helperText="Test environment"
                value={application.token_sandbox}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          onClick={() => {
                            this.copyToClipboard('token_sandbox');
                          }}
                        >
                          <FileCopy />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={snackBarOpen}
                autoHideDuration={1000}
                onClose={() => {
                  this.handleClose();
                }}
                message={<span>Copied!</span>}
              />
            </>
          )}
        </div>
      </>
    );
  }
}

DetailsPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(DetailsPage));
