import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { authAPI } from '../api';
import { setCredentials, setLoading } from '../store/slices/authSlice';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setError('');
    dispatch(setLoading(true));
    
    try {
      const response = await authAPI.register(data);
      
      if (response.data.success) {
        dispatch(setCredentials({
          user: response.data.data.user,
          token: response.data.data.token
        }));
        toast.success('Registration successful! Welcome to Company Portal.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom color="primary">
            Company Portal
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Create Your Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            <TextField
              margin="normal"
              required
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
            <FormControl fullWidth margin="normal" error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                defaultValue=""
                {...register('gender', { required: 'Gender is required' })}
              >
                <MenuItem value="m">Male</MenuItem>
                <MenuItem value="f">Female</MenuItem>
                <MenuItem value="o">Other</MenuItem>
              </Select>
              {errors.gender && (
                <Typography variant="caption" color="error">
                  {errors.gender.message}
                </Typography>
              )}
            </FormControl>
            <TextField
              margin="normal"
              required
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;