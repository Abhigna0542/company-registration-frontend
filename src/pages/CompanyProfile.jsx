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
  Avatar,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  CloudUpload,
  Add,
  Delete,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyAPI } from '../api';
import { setCompanyProfile, updateCompanyProfile } from '../store/slices/companySlice';
import LoadingSpinner from '../components/LoadingSpinner';

const CompanyProfile = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const dispatch = useDispatch();
  const { companyProfile, loading } = useSelector(state => state.company);
  const [uploading, setUploading] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Hospitality',
    'Transportation',
    'Construction',
    'Other'
  ];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    if (companyProfile) {
      // Reset form with company profile data
      const formData = {
        company_name: companyProfile.company_name || '',
        address: companyProfile.address || '',
        city: companyProfile.city || '',
        state: companyProfile.state || '',
        country: companyProfile.country || '',
        postal_code: companyProfile.postal_code || '',
        website: companyProfile.website || '',
        industry: companyProfile.industry || '',
        founded_date: companyProfile.founded_date || '',
        description: companyProfile.description || '',
      };
      reset(formData);

      // Set social links
      if (companyProfile.social_links) {
        setSocialLinks(Array.isArray(companyProfile.social_links) 
          ? companyProfile.social_links 
          : JSON.parse(companyProfile.social_links)
        );
      }
    } else {
      // Reset form to empty if no company profile
      reset({
        company_name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        website: '',
        industry: '',
        founded_date: '',
        description: '',
      });
      setSocialLinks([]);
    }
  }, [companyProfile, reset]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyAPI.getProfile();
      if (response.data.success) {
        dispatch(setCompanyProfile(response.data.data.company));
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load company profile');
      }
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(type, file);

      const response = type === 'logo' 
        ? await companyAPI.uploadLogo(formData)
        : await companyAPI.uploadBanner(formData);

      if (response.data.success) {
        // Fetch updated profile to get the new image URLs
        await fetchCompanyProfile();
        toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      // Validate URL
      try {
        new URL(newSocialLink.url);
        setSocialLinks(prev => [...prev, { ...newSocialLink }]);
        setNewSocialLink({ platform: '', url: '' });
        toast.success('Social link added');
      } catch (e) {
        toast.error('Please enter a valid URL');
      }
    } else {
      toast.error('Please fill both platform and URL');
    }
  };

  const removeSocialLink = (index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
    toast.success('Social link removed');
  };

  const onSubmit = async (data) => {
    try {
      const companyData = {
        ...data,
        social_links: socialLinks
      };

      const response = await companyAPI.createProfile(companyData);
      
      if (response.data.success) {
        // Fetch the updated profile to get all data including IDs
        await fetchCompanyProfile();
        toast.success('Company profile saved successfully');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save company profile');
    }
  };

  const calculateCompletion = (profile) => {
    if (!profile) return 0;
    
    let completion = 0;
    const requiredFields = ['company_name', 'address', 'city', 'state', 'country', 'postal_code', 'industry'];
    const optionalFields = ['description', 'logo_url', 'website'];
    
    requiredFields.forEach(field => {
      if (profile[field] && profile[field].trim() !== '') completion += 10;
    });
    
    optionalFields.forEach(field => {
      if (profile[field] && profile[field].trim() !== '') completion += 5;
    });
    
    return Math.min(completion, 100);
  };

  const completionPercentage = companyProfile ? calculateCompletion(companyProfile) : 0;

  // Get base URL for images - handle both development and production
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  // Watch form values to see current state
  const formValues = watch();

  if (loading && !companyProfile) {
    return <LoadingSpinner message="Loading company profile..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Company Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Progress Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Profile Completion
                </Typography>
                <Typography variant="h6" color="primary">
                  {completionPercentage}%
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  height: 8, 
                  backgroundColor: 'grey.200', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    height: '100%', 
                    backgroundColor: completionPercentage === 100 ? 'success.main' : 'primary.main',
                    width: `${completionPercentage}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {completionPercentage === 100 
                  ? 'Profile complete! All required fields are filled.' 
                  : 'Complete all required fields to reach 100%'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Logo and Banner Upload */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Company Logo
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar
                  src={getImageUrl(companyProfile?.logo_url)}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    backgroundColor: 'grey.100',
                    fontSize: '3rem'
                  }}
                  variant="rounded"
                >
                  {!companyProfile?.logo_url && <PhotoCamera />}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'logo')}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  PNG, JPG up to 5MB
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Company Banner
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    backgroundColor: 'grey.100',
                    backgroundImage: companyProfile?.banner_url ? `url(${getImageUrl(companyProfile.banner_url)})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    mb: 2,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {!companyProfile?.banner_url && (
                    <>
                      <PhotoCamera sx={{ fontSize: 40, color: 'grey.400' }} />
                      <Typography variant="body2" color="text.secondary" align="center">
                        No banner uploaded
                      </Typography>
                    </>
                  )}
                </Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="banner-upload"
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'banner')}
                />
                <label htmlFor="banner-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Banner'}
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  PNG, JPG up to 5MB
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Details Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      {...register('company_name', { 
                        required: 'Company name is required',
                        minLength: {
                          value: 2,
                          message: 'Company name must be at least 2 characters'
                        }
                      })}
                      error={!!errors.company_name}
                      helperText={errors.company_name?.message}
                      // Key fix: Ensure the value is properly set
                      value={formValues.company_name || ''}
                      onChange={(e) => setValue('company_name', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address *"
                      multiline
                      rows={2}
                      {...register('address', { 
                        required: 'Address is required',
                        minLength: {
                          value: 5,
                          message: 'Address must be at least 5 characters'
                        }
                      })}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      value={formValues.address || ''}
                      onChange={(e) => setValue('address', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City *"
                      {...register('city', { 
                        required: 'City is required',
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'City can only contain letters and spaces'
                        }
                      })}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      value={formValues.city || ''}
                      onChange={(e) => setValue('city', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State *"
                      {...register('state', { 
                        required: 'State is required',
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'State can only contain letters and spaces'
                        }
                      })}
                      error={!!errors.state}
                      helperText={errors.state?.message}
                      value={formValues.state || ''}
                      onChange={(e) => setValue('state', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country *"
                      {...register('country', { 
                        required: 'Country is required',
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'Country can only contain letters and spaces'
                        }
                      })}
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      value={formValues.country || ''}
                      onChange={(e) => setValue('country', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code *"
                      {...register('postal_code', { 
                        required: 'Postal code is required',
                        pattern: {
                          value: /^[A-Za-z0-9\s\-]+$/,
                          message: 'Invalid postal code format'
                        }
                      })}
                      error={!!errors.postal_code}
                      helperText={errors.postal_code?.message}
                      value={formValues.postal_code || ''}
                      onChange={(e) => setValue('postal_code', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.industry}>
                      <InputLabel>Industry *</InputLabel>
                      <Select
                        label="Industry *"
                        {...register('industry', { required: 'Industry is required' })}
                        value={formValues.industry || ''}
                        onChange={(e) => setValue('industry', e.target.value)}
                      >
                        <MenuItem value="">
                          <em>Select Industry</em>
                        </MenuItem>
                        {industries.map(industry => (
                          <MenuItem key={industry} value={industry}>
                            {industry}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.industry && (
                        <Typography variant="caption" color="error">
                          {errors.industry.message}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      type="url"
                      {...register('website', {
                        pattern: {
                          value: /^https?:\/\/.+\..+/,
                          message: 'Please enter a valid website URL'
                        }
                      })}
                      error={!!errors.website}
                      helperText={errors.website?.message || 'e.g., https://example.com'}
                      value={formValues.website || ''}
                      onChange={(e) => setValue('website', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Founded Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('founded_date')}
                      value={formValues.founded_date || ''}
                      onChange={(e) => setValue('founded_date', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Description"
                      multiline
                      rows={3}
                      {...register('description')}
                      helperText="Tell us about your company (optional)"
                      value={formValues.description || ''}
                      onChange={(e) => setValue('description', e.target.value)}
                    />
                  </Grid>

                  {/* Social Links */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Social Links
                    </Typography>
                    <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Platform"
                          value={newSocialLink.platform}
                          onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                          placeholder="e.g., LinkedIn, Twitter"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="URL"
                          value={newSocialLink.url}
                          onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={addSocialLink}
                          disabled={!newSocialLink.platform || !newSocialLink.url}
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      {socialLinks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center">
                          No social links added yet
                        </Typography>
                      ) : (
                        socialLinks.map((link, index) => (
                          <Chip
                            key={index}
                            label={`${link.platform}: ${link.url}`}
                            onDelete={() => removeSocialLink(index)}
                            sx={{ m: 0.5 }}
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Save />}
                      sx={{ mt: 2 }}
                    >
                      Save Company Profile
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyProfile;