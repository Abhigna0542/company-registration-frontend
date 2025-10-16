import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save,
  Security,
  Notifications,
  Language,
  Person,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authAPI } from '../api';
import { updateUser } from '../store/slices/authSlice';

const Settings = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'PST', label: 'Pacific Time (PST)' },
    { value: 'CET', label: 'Central European Time (CET)' },
  ];

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ];

  useEffect(() => {
    if (user) {
      setValue('firstName', user.full_name?.split(' ')[0] || '');
      setValue('lastName', user.full_name?.split(' ')[1] || '');
      setValue('email', user.email || '');
      setValue('mobile_no', user.mobile_no || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess('');
    
    try {
      // Simulate API call - in real app, you'd have a settings API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user in Redux store
      dispatch(updateUser({
        full_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        mobile_no: data.mobile_no
      }));
      
      setSuccess('Settings updated successfully!');
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Password updated successfully');
      setValue('currentPassword', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Profile Settings
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register('firstName', { required: 'First name is required' })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register('lastName', { required: 'Last name is required' })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      {...register('mobile_no', { 
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^\+?[\d\s-()]+$/,
                          message: 'Invalid mobile number'
                        }
                      })}
                      error={!!errors.mobile_no}
                      helperText={errors.mobile_no?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    >
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Security sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Security Settings
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onPasswordSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      {...register('currentPassword', { required: 'Current password is required' })}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      {...register('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      {...register('confirmPassword', { required: 'Please confirm your password' })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Notification Settings
                </Typography>
              </Box>

              <Box>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Security Alerts"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Marketing Emails"
                />
              </Box>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                startIcon={<Save />}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Language sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Preferences
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      label="Language"
                      defaultValue="en"
                    >
                      {languages.map(lang => (
                        <MenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      label="Timezone"
                      defaultValue="UTC"
                    >
                      {timezones.map(tz => (
                        <MenuItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      label="Theme"
                      defaultValue="light"
                    >
                      {themes.map(theme => (
                        <MenuItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                  >
                    Save Preferences
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;