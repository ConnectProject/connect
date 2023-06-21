import React from 'react';
import { useHistory } from "react-router-dom";
import Parse from 'parse';

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

import Routes from './Router';
import PubSub from '../utils/pub-sub';
import UserService from '../services/user-service';

const options = ['Home', 'Documentation', 'My Profile'];

const App = function () {
  const [canBack, setCanBack] = React.useState(false);
  const [userConnected, setUserConnected] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (!['/home', '/', '/authorize'].includes(history.location.pathname)) {
      setCanBack(true);
    }
    history.listen((location) => {
      if (location.pathname !== '/home' && location.pathname !== '/') {
        setCanBack(true);
      } else {
        setCanBack(false);
      }
    });

    const currentUser = UserService.getCurrentUser();
    setUserConnected(currentUser !== null);
    if (
      currentUser === null &&
      !['/', '/authorize'].includes(history.location.pathname)
    ) {
      history.push('/');
    }
    PubSub.subscribe(UserService.PubSubEvents.AUTH_STATUS_UPDATED, async () => {
      const newUser = await UserService.getCurrentUserAsync();
      if (!newUser) {
        history.push('/');
      }
      setUserConnected(newUser !== null);
    });
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentNode);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, index) => {
    if (index === 0) {
      history.push('/');
    } else if (index === 1) {
      window.open(
        'https://github.com/ConnectProject/connect/blob/master/docs/usage.md',
        '_blank',
      );
    } else if (index === 2) {
      history.push('/profile');
    }

    handleClose();
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          {canBack && (
            <IconButton
              edge="start"
              className="margin-right': 16"
              color="inherit"
              onClick={goBack}
            >
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

      <Routes />
    </div >
  );
};

export default App;
