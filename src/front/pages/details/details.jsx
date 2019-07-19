/* eslint-disable no-underscore-dangle */
/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

import PropTypes from 'prop-types'; // ES6

import { getApplication, updateApplication } from '../../services/api';


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
      application: {}
    }
  }

  componentDidMount() {
    const { match } = this.props;
    getApplication(match.params.appId).then((res) => {
      this.setState({
        loading: false,
        application: res
      });
    });
  }

  handleChange(name, event) {
    const { application } = this.state;
    this.setState({
      application: {
        ...application,
        [name]: event.target.value
      } 
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

  render() {
    const { classes } = this.props;
    const { application, loading, updateLoading } = this.state;
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
              />

              <div className={classes.buttonContainer}>
                <Button 
                  variant="outlined" 
                  className={classes.button}
                  onClick={() => this.goBack()}
                >
                  Close
                </Button>

                <div className={classes.wrapper}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    disabled={updateLoading}
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
                onChange={(event) => this.handleChange('token', event)}
                margin="normal"
                variant="outlined"
              />


              <TextField
                disabled
                id="token_sandbox"
                label="Token Sandbox"
                className={classes.textField}
                fullWidth
                value={application.token_sandbox}
                onChange={(event) => this.handleChange('token_sandbox', event)}
                margin="normal"
                variant="outlined"
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
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};


export default withRouter(withStyles(styles)(DetailsPage));
