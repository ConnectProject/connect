/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Moment from 'react-moment';

import { validateFormField, checkValid } from '../../services/formValidator';
import ApplicationsService from '../../services/applications-service';


const HomePage = function () {
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
      appleStoreLink: '',
      googleMarketLink: '',
    });
    setErrors({
      name: false,
      description: false,
      appleStoreLink: false,
      googleMarketLink: false,
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
      <List sx={{
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
      }}>
        {loading && <CircularProgress sx={{
          margin: '0 auto',
          'marginTop': 17.5,
        }} />}

        {!loading &&
          developerApplications.map((application) => (
            <div key={application.id} style={{ width: '100%' }}>
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
                        sx={{
                          display: 'inline',
                          color: 'text.primary'
                        }}
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
        <Card sx={{
          maxWidth: 720,
          margin: '0 auto',
          marginTop: 15
        }}>
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
        sx={{
          position: 'absolute',
          bottom: 32,
          right: 32,
        }}
        onClick={() => handleClickOpen()}
      >
        <AddIcon sx={{ marginRight: 2 }} />
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

export default HomePage;
