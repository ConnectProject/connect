/* eslint-disable no-underscore-dangle */
/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types'; // ES6

import { listOfApplications } from '../../services/api';


const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: "0 auto",
    display: "flex",
    flexWrap: 'wrap',
  },
  progress: {
    margin: "0 auto",
    "margin-top": 140
  },
  listContainer: {
    width: "100%"
  },
  inline: {
    display: 'inline',
  },

};


class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      developerApplications: []
    }
  }

  componentDidMount() {
    listOfApplications().then((res) => {
      this.setState({
        loading: false,
        developerApplications: res
      });
    });
  }

  rowClick(application) {
    const { history } = this.props;
    history.push(`/application/${application._id}`);
  }

  render() {
    const { classes } = this.props;
    const { developerApplications, loading } = this.state;
    return (
      <>
        <List className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading &&
            developerApplications.map(application => (
              <div key={application._id} className={classes.listContainer}>
                <ListItem alignItems="flex-start" button onClick={() => this.rowClick(application)}>
                  <ListItemText
                    primary={
                      (
                        <React.Fragment>
                          {application.name}
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {` - ${application.updated_at}`}
                          </Typography>
  
                        </React.Fragment>
                        )}
                    secondary={application.description}
                  />
                </ListItem>
                <Divider component="li" />
              </div>
            ))
          }
        </List>

      </>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(HomePage));
