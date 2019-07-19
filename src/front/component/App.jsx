/* eslint-disable react/forbid-prop-types */
import * as React from 'react';
import { BrowserRouter as Router, withRouter, Redirect } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';



import { logout, connectedState } from '../services/auth';
import Routes from "./Router";


const options = ['Documentation','My Profile'];

class App extends React.PureComponent {

  constructor() {
    super();    
    this.state = {
      canBack: false,
      userConnected : false,
       anchorRef: {current: null}, 
       selectedIndex: 0, 
       open: false
    };
  }
  
  componentDidMount() {
    const { history } = this.props;
    if (history.location.pathname !== '/home' && history.location.pathname !== '/') {
      this.setState({canBack: true});
    }
    history.listen((location, action) => {
      console.log(location);
      if (location.pathname !== '/home' && location.pathname !== '/') {
        this.setState({canBack: true});
      } else {
        this.setState({canBack: false});
      }
    });


    connectedState.subscribe((userConnected) => {
      this.setState({userConnected});
    });

  }

  async handleMenuItemClick(event, index) {
    const { history } = this.props;
    if (index === 1) {
      history.push('/profile')
    }

    this.handleToggle()
    
  }

  handleToggle() {
    const { open } = this.state;
    this.setState({
      open: !open
    })
  }

  handleClose(event) {
    const { anchorRef } = this.state;
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    this.setState({
      open: false
    })
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }


  render() {
    const { userConnected, anchorRef, selectedIndex, open, canBack } = this.state;

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            {canBack && (
            <IconButton 
              edge="start" 
              className="margin-right': 16"
              color="inherit"
              onClick={() => {this.goBack()}}
            >
              <ArrowBack />
            </IconButton>
)}

            <Typography variant="h6" color="inherit">
              Connect
            </Typography>
            <div className="spacer" />

            {userConnected && 
            (
              <>
                <ButtonGroup ref={anchorRef} aria-label="Split button">
                  <Button 
                    color="inherit" 
                    onClick={() => {logout(); window.location.href = '/'}}
                  >
                    Logout
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    aria-owns={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={() => this.handleToggle()}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper id="menu-list-grow">
                        <ClickAwayListener onClickAway={() => this.handleClose()}>
                          <MenuList>
                            {options.map((option, index) => (
                              <MenuItem
                                key={option}
                                disabled={index === 2}
                                selected={index === selectedIndex}
                                onClick={event => this.handleMenuItemClick(event, index)}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )
            }
          </Toolbar>
        </AppBar>

        <Routes />
      </div>
    );
  }
}


export default withRouter(App);
