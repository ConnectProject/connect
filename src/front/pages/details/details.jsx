/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types'; // ES6

import { getApplication } from '../../services/api';


const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: "0 auto",
    display: 'flex',
    flexWrap: 'wrap',
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
  }
};


class DetailsPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      application: {
        name: "Name",
        description: "Description",
        token: "token",
        token_sandbox: "token sandbox",
        apple_store_link: "http://apple",
        google_market_link: "http://google",
        create_at: new Date(),
        updated_at: new Date(),
      }
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

  render() {
    const { classes } = this.props;
    const { application, loading } = this.state;
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

              <TextField
                id="apple_store_link"
                label="App Store Link"
                className={classes.textField}
                fullWidth
                value={application.apple_store_link}
                onChange={(event) => this.handleChange('apple_store_link', event)}
                margin="normal"
                variant="outlined"
              />


              <TextField
                id="google_market_link"
                label="Play Store Link"
                className={classes.textField}
                fullWidth
                value={application.google_market_link}
                onChange={(event) => this.handleChange('google_market_link', event)}
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
  // history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};


export default withRouter(withStyles(styles)(DetailsPage));
