import * as React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Router";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { hasJwt, logout } from '../services/auth';


class App extends React.Component {

  signout() {
    logout();
  }

  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Connect
            </Typography>
            <div className="spacer"></div>
            {hasJwt() && <Button color="inherit" onClick={this.signout()}>Logout</Button>}
           
          </Toolbar>
        </AppBar>

        <Router>
          <Routes />
        </Router>
      </div>
    );
  }
}

export default App;
