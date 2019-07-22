/* eslint-disable no-underscore-dangle */
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

import { getUser, updateUser, deleteUser } from '../../services/api';


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
    width: 180
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
  nameContainer: {
    display: 'flex',
    width: "100%",
  }

 
};


class ProfilePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      updateLoading: false,
      user: {},
      dialogOpen: false,
    }
  }

  componentDidMount() {
    getUser().then((res) => {
      this.setState({
        loading: false,
        user: res
      });
    });
  }

  handleChange(name, event) {
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
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
    const response = await updateUser(application._id, application);
    this.setState({
      updateLoading: false,
      user: response
    })
  }

  confirmationDialog() {
    this.setState({
      dialogOpen: true
    });
  }

  async handleClose(userToBeDeleted) {
    if (userToBeDeleted){
      await deleteUser();
      const { history } = this.props;
      history.push('/');
    } else {
      this.setState({
        dialogOpen: false
      });  
    }
  }

  render() {
    const { classes } = this.props;
    const { user, loading, updateLoading, dialogOpen } = this.state;
    return (
      <>
        <div className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading &&
          (
            <>
              <div className={classes.nameContainer}>
                <TextField
                  id="firstName"
                  label="First Name"
                  className={classes.textField}
                  fullWidth
                  value={user.firstName}
                  onChange={(event) => this.handleChange('firstName', event)}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  id="lastName"
                  label="Last Name"
                  className={classes.textField}
                  fullWidth
                  value={user.lastName}
                  onChange={(event) => this.handleChange('lastName', event)}
                  margin="normal"
                  variant="outlined"
                />
              </div>

              <TextField
                id="email"
                label="Email"
                className={classes.textField}
                fullWidth
                value={user.email}
                onChange={(event) => this.handleChange('email', event)}
                margin="normal"
                variant="outlined"
              />

              <div className={classes.buttonContainer}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  className={classes.button}
                  onClick={() => this.confirmationDialog()}
                >
                  Delete Profile
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

            </>
          )
          }
        </div>

        <Dialog
          open={dialogOpen}
          onClose={() => this.handleClose(false)}
        >
          <DialogTitle>Delete your profile?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your profile will be deleted forever and your applications will stop working.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose(true)} color="secondary">
              Delete
            </Button>
            <Button onClick={() => this.handleClose(false)} color="primary" autoFocus>
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
