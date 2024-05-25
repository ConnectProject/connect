import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Parse from 'parse';
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import UserService from '../services/user-service';
import PubSub from '../utils/pub-sub';

import Router from './Router';

const options = ['Home', 'Documentation', 'My Profile'];

const App = function App () {
  const [canBack, setCanBack] = React.useState(false);
  const [userConnected, setUserConnected] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (!['/home', '/', '/authorize'].includes(location.pathname)) {
      setCanBack(true);
    } else {
      setCanBack(false);
    }

    const currentUser = UserService.getCurrentUser();
    setUserConnected(currentUser !== null);
    if (
      currentUser === null &&
      !['/', '/authorize'].includes(location.pathname)
    ) {
      navigate('/');
    }
    PubSub.subscribe(UserService.PubSubEvents.AUTH_STATUS_UPDATED, async () => {
      const newUser = await UserService.getCurrentUserAsync();
      if (!newUser) {
        navigate('/');
      }
      setUserConnected(newUser !== null);
    });
  }, [location]);

  const handleMenuClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentNode);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, index) => {
    if (index === 0) {
      navigate('/');
    } else if (index === 1) {
      window.open(
        'https://github.com/ConnectProject/connect/blob/master/docs/usage.md',
        '_blank',
      );
    } else if (index === 2) {
      navigate('/profile');
    }

    handleClose();
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <AppBar position="sticky" color="default">
        <Toolbar>
          {canBack && (
            <IconButton
              edge="start"
              className="margin-right': 16"
              color="inherit"
              onClick={goBack}
              size="large">
              <ArrowBack />
            </IconButton>
          )}

          <Typography variant="h6" color="inherit">
            Connect
          </Typography>
          <div className="spacer" style={{ flex: 1 }} />
          {userConnected && (
            <>
              <ButtonGroup aria-label="Split button">
                <Button
                  color="inherit"
                  onClick={() => {
                    Parse.User.logOut();
                    window.location.href = '/';
                  }}
                >
                  Logout
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  aria-owns={open ? 'menu-list-grow' : null}
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom'
                          ? 'center top'
                          : 'center bottom',
                    }}
                  >
                    <Paper id="menu-list-grow">
                      <ClickAwayListener
                        onClickAway={handleClose}
                      >
                        <MenuList>
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              disabled={index === 3}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
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
          )}
        </Toolbar>
      </AppBar>

      <Router />
    </div >
  );
};

export default App;
