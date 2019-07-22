/* eslint-disable no-underscore-dangle */
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

import { getApplication, updateApplication } from '../../services/api';
import { validateFormField, checkValid } from '../../services/formValidator';


const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: "0 auto",
    display: 'flex',
    flexWrap: 'wrap',
    "margin-top": 16
  },
  progress: {
    margin: "0 auto",
    "margin-top": 140
  },
  listContainer: {
    width: "100%"
  },
  textField: {
    margin: 16
  },
  button: {
    margin: 8,
    width: 120
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    "justify-content": "flex-end",
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
      snackBarOpen: false,
      errors: {
        name: false,
        description: false,
        apple_store_link: false,
        google_market_link: false,
      }
    }
  }

  componentDidMount() {
    const { match } = this.props;
    getApplication(match.params.appId).then((res) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          application: res  
        }
      });
    });
  }

  handleChange(name, event) {
    const { application, errors } = this.state;
    const { value } = event.target;

    const validated = validateFormField(value, name);
    this.setState({
      application: {
        ...application,
        [name]: value
      },
      errors: {
        ...errors,
        [name]: !validated
      }
    });
  }

  handleClick() {
    this.setState({
      snackBarOpen: true
    });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackBarOpen: false
    });
  }


  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  async clickUpdateApplication() {
    const { application } = this.state;
    this.setState({
      updateLoading: true
    })
    const response = await updateApplication(application._id, application);
    this.setState({
      updateLoading: false,
      application: response
    })
  }

  copyToClipboard(key) {
    const { application } = this.state;
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(application[key]);
        this.setState({snackBarOpen: true});
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { application, errors, loading, updateLoading, snackBarOpen } = this.state;
    return (
      <>
        <div className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading &&
          (
            <>
              <TextField
                id="name"
                label="Name"
                className={classes.textField}
                fullWidth
                value={application.name}
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
                value={application.description}
                onChange={(event) => this.handleChange('description', event)}
                margin="normal"
                variant="outlined"
                multiline
                rows="4"  
                error={errors.name}      
              />

              <TextField
                id="apple_store_link"
                label="App Store Link"
                className={classes.textField}
                fullWidth
                value={application.apple_store_link || ''}
                onChange={(event) => this.handleChange('apple_store_link', event)}
                margin="normal"
                variant="outlined"
                error={errors.apple_store_link}
              />

              <TextField
                id="google_market_link"
                label="Play Store Link"
                className={classes.textField}
                fullWidth
                value={application.google_market_link || ''}
                onChange={(event) => this.handleChange('google_market_link', event)}
                margin="normal"
                variant="outlined"
                error={errors.google_market_link}
              />

              <div className={classes.buttonContainer}>
                <div className={classes.wrapper}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    disabled={updateLoading || (!checkValid(errors))}
                    className={classes.button}
                    onClick={() => this.clickUpdateApplication()}
                  >
                    Save
                  </Button>
                  {updateLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </div>

              <TextField
                disabled
                id="token"
                label="Token"
                className={classes.textField}
                fullWidth
                value={application.token}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => {this.copyToClipboard('token')}}>
                        <FileCopy />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />


              <TextField
                disabled
                id="token_sandbox"
                label="Token Sandbox"
                className={classes.textField}
                fullWidth
                value={application.token_sandbox}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => {this.copyToClipboard('token_sandbox')}}>
                        <FileCopy />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={snackBarOpen}
                autoHideDuration={1000}
                onClose={() => {this.handleClose()}}
                message={<span>Copied!</span>}
              />

            </>
          )
          }
        </div>

      </>
    );
  }
}

DetailsPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired
};


export default withRouter(withStyles(styles)(DetailsPage));
