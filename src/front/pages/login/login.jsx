import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6

import * as React from 'react';
import { hasJwt } from '../../services/auth';

const styles = {
  card: {
    maxWidth: 345,
    margin: '0 auto',
    'margin-top': '10%',
  },
  media: {
    height: 140,
  },
  buttonContainer: {
    'justify-content': 'center',
  },
};

class LoginPage extends React.PureComponent {
  componentDidMount() {
    if (hasJwt()) {
      const { history } = this.props;
      history.push('/home');
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <CardMedia
            className={classes.media}
            image="/image.png"
            title="Connect title"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Welcome
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              To start using Connect, please use your GitHub to login.
            </Typography>
          </CardContent>
        </CardContent>
        <CardActions className={classes.buttonContainer}>
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${window._env_.GITHUB_CLIENT_ID}`}
            title="Connect with GitHub"
          >
            <Button size="large" color="primary">
              Login
            </Button>
          </a>
        </CardActions>
      </Card>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(LoginPage));
