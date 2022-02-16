import React, {useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getIsSignedIn} from '../../reducks/users/selectors';
import { makeStyles } from '@mui/styles';
import logo from '../../assets/img/icons/shusyu-logo.png'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {push} from 'connected-react-router';
import {HeaderMenus, ClosableDrawer} from './index'

const useStyles = makeStyles({
  root: {
    flexGlow: 1,
  },
  menuBar: {
    backgroundColor: '#fff',
    color: '#444'
  },
  toolBar: {
    margin: '0 auto',
    maxWidth: 1024,
    width: '100%'
  },
  iconButtons: {
    margin: '0 0 0 auto'
  }
});

const Header = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selector = useSelector((state) => state);
  const isSignedIn = getIsSignedIn(selector);

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback((event) => {
    if (event.type === 'keydown' && (event.key === 'tab' || event.key === 'shift')) {
      return;
    }
    setOpen(!open)
  }, [setOpen, open])

  return (
    <div className={classes.root}>
      <AppBar sx={{backgroundColor: '#fff'}} position='fixed' className={classes.menuBar}>
        <Toolbar className={classes.toolbar}>
          <img
            src={logo}
            alt='Shusyu logo'
            width='140px'
            onClick={() => dispatch(push('/'))}
          />
          {isSignedIn && (
            <div className={classes.iconButtons}>
              <HeaderMenus handleDrawerToggle={handleDrawerToggle}/>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <ClosableDrawer
        open={open}
        onClose={handleDrawerToggle}
      />
    </div>
  )
}

export default Header
