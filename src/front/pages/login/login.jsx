import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'; // ES6

import * as React from 'react';
import UserService from '../../services/user-service';
import LoginActions from '../../component/LoginActions';

const styles = {
  card: {
    maxWidth: 345,
    margin: '0 auto',
    'margin-top': '10%',
  },
  media: {
    height: 140,
  },
};

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
  }

  componentDidMount() {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      const { history } = this.props;
      history.push('/home');
    }
  }

  onUserLoggedIn(user) {
    if (user) {
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
              To start using Connect, please use your GitHub account to login?
            </Typography>
          </CardContent>
        </CardContent>
        <LoginActions onUserLoggedIn={this.onUserLoggedIn} />
      </Card>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(LoginPage));
