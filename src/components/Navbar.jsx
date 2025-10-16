import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Business,
  Settings,
  Logout,
  Assignment, // ADDED: This was missing
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    handleClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Company Profile', icon: <Business />, path: '/company-profile' },
    { text: 'Tasks', icon: <Assignment />, path: '/tasks' }, // ADDED: Tasks menu item
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const NavContent = () => (
    <>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        Company Portal
      </Typography>
      
      {!isMobile && (
        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              variant={location.pathname === item.path ? "outlined" : "text"}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Welcome, {user?.full_name || 'User'}
        </Typography>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
            <Settings sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </>
  );

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {isMobile && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setMobileDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileDrawer}
              onClose={() => setMobileDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => setMobileDrawer(false)}
                onKeyDown={() => setMobileDrawer(false)}
              >
                <List>
                  {menuItems.map((item) => (
                    <ListItem 
                      button 
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      selected={location.pathname === item.path}
                    >
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        )}
        <NavContent />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;