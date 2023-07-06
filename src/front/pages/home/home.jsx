/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Moment from 'react-moment';

import PropTypes from 'prop-types'; // ES6

import { validateFormField, checkValid } from '../../services/formValidator';
import ApplicationsService from '../../services/applications-service';

const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
  progress: {
    margin: '0 auto',
    'margin-top': 140,
  },
  listContainer: {
    width: '100%',
  },
  inline: {
    display: 'inline',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
  extendedIcon: {
    marginRight: 16,
  },

  card: {
    maxWidth: 720,
    margin: '0 auto',
    marginTop: 120,
  },
};

const HomePage = function ({ classes }) {
  const [loading, setLoading] = useState(true);
  const [dialogNewApplicationOpen, setDialogNewApplicationOpen] = useState(false);
  const [developerApplications, setDeveloperApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({
    name: '',
    description: '',
    appleStoreLink: '',
    googleMarketLink: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    appleStoreLink: false,
    googleMarketLink: false,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    ApplicationsService.listApplications()
      .then((applications) => {
        setLoading(false);
        setDeveloperApplications(applications);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setDeveloperApplications([]);
      });
  }, []);

  const handleClickOpen = function () {
    setDialogNewApplicationOpen(true);
  };

  const handleClose = function () {
    setDialogNewApplicationOpen(false);
    setNewApplication({
      name: '',
      description: '',
      apple_store_link: '',
      google_market_link: '',
    });
    setErrors({
      name: false,
      description: false,
      apple_store_link: false,
      google_market_link: false,
    });
    setErrorMessage(null);
  };

  const handleChange = function (name, event) {
    const { value } = event.target;
    const validated = validateFormField(value, name);
    setNewApplication(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevState => ({
      ...prevState,
      [name]: !validated
    }));
  };

  const rowClick = function (application) {
    navigate(`/application/${application.id}`);
  };

  const clickCreateApplication = async function () {
    try {
      const app = await ApplicationsService.create(newApplication);
      navigate(`/application/${app.id}`);
    } catch (err) {
      console.error(err, err.message);
      setErrorMessage(err.message || 'An error occured.');
    }
  };

  return (
    <>
      <List className={classes.root}>
        {loading && <CircularProgress className={classes.progress} />}

        {!loading &&
          developerApplications.map((application) => (
            <div key={application.id} className={classes.listContainer}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => rowClick(application)}
              >
                <ListItemText
                  primary={
                    <>
                      {application.attributes.name}
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {' - '}
                        <Moment format="YYYY-MM-DD HH:mm">
                          {application.attributes.updatedAt}
                        </Moment>
                      </Typography>
                    </>
                  }
                  secondary={application.attributes.description}
                />
              </ListItem>
              <Divider component="li" />
            </div>
          ))}
      </List>

      {developerApplications.length === 0 && !loading && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <DeveloperModeIcon />
              {'  '} Welcome
            </Typography>
            <Typography variant="body1" component="p">
              Add your first application with the bottom right button.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Go to documentation</Button>
          </CardActions>
        </Card>
      )}

      <Fab
        variant="extended"
        size="large"
        color="primary"
        aria-label="Add"
        className={classes.fab}
        onClick={() => handleClickOpen()}
      >
        <AddIcon className={classes.extendedIcon} />
        New application
      </Fab>

      <Dialog
        open={dialogNewApplicationOpen}
        onClose={() => handleClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the required fields to create a new application. It will
            allow you to get Token to use Connect API.
          </DialogContentText>
          <TextField
            autoFocus
            required
            id="name"
            label="Name"
            className={classes.textField}
            fullWidth
            value={newApplication.name}
            onChange={(event) => handleChange('name', event)}
            margin="normal"
            variant="outlined"
            error={errors.name}
          />

          <TextField
            required
            id="description"
            label="Description"
            className={classes.textField}
            fullWidth
            value={newApplication.description}
            onChange={(event) => handleChange('description', event)}
            margin="normal"
            variant="outlined"
            multiline
            minRows={2}
            error={errors.description}
          />

          <TextField
            id="appleStoreLink"
            label="App Store Link"
            className={classes.textField}
            fullWidth
            value={newApplication.appleStoreLink}
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
            value={newApplication.googleMarketLink}
            onChange={(event) => handleChange('googleMarketLink', event)}
            margin="normal"
            variant="outlined"
            error={errors.googleMarketLink}
          />
          {errorMessage && (
            <DialogContentText align="right" color="error">
              {errorMessage}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button
            disabled={
              !checkValid(errors) ||
              !newApplication.name ||
              !newApplication.description
            }
            onClick={() => clickCreateApplication()}
            color="primary"
          >
            Create application
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


HomePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(HomePage);
