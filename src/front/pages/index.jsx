import * as React from 'react';
import { hasJwt } from '../services/auth';
import Page from '../component/Page';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 345,
    margin: "0 auto",
    "margin-top": "10%",
  },
  media: {
    height: 140,
  },
  buttonContainer: {
    "justify-content": "center",
  }
};


class Home extends React.Component {
  render() {

    if (hasJwt()) {
      return this.props.history.push('/home');
    }

    const { classes } = this.props; 
    return (
      <Page isPublic>
        <Card className={classes.card}>
          <CardContent>
            <CardMedia
              className={classes.media}
              image="/static/images/cards/contemplative-reptile.jpg"
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
              href={`https://github.com/login/oauth/authorize?client_id=c262ab4075b97372f8a4`}
              title="Connect with GitHub"
            >
              <Button size="large" color="primary">
                Login
              </Button>
            </a>
          </CardActions>
        </Card>
      </Page>
    );
  }
}

export default withRouter(withStyles(styles)(Home));
