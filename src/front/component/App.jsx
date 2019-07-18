import * as React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Router";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { hasJwt, logout, connectedState } from '../services/auth';


class App extends React.PureComponent {

  constructor() {
    super();    
    this.state = {userConnected : false};
  }
  
  componentDidMount() {

    connectedState.subscribe((userConnected) => {
      console.log(`Connected State: ${userConnected}`);
      this.setState({userConnected});
    })
  }

  render() {
    const { userConnected } = this.state;
    const { history } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Connect
            </Typography>
            <div className="spacer" />

            {userConnected && <Button color="inherit" onClick={() => {logout(); window.location.href = '/'}}>Logout</Button>}
           
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
