import * as React from 'react';
import { hasJwt } from '../../services/auth';
import Page from '../../component/Page';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

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


class ConnectedHome extends React.Component {
  render() {

    const { classes } = this.props; 
    return (
      <Page>
        {hasJwt() && <div>Your are authorize to see this</div>}
      </Page>
    );
  }
}

export default withRouter(withStyles(styles)(ConnectedHome));
