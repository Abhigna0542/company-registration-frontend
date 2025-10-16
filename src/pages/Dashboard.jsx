import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Business, 
  CheckCircle, 
  Warning, 
  Info,
  TrendingUp,
  People,
  Assignment,
  CalendarToday,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { companyAPI } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { tasks } = useSelector(state => state.tasks);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileCompletion: 0,
    tasksPending: 0,
    upcomingDeadlines: 0, // Replace notifications with this
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  // Update stats when tasks or company profile changes
  useEffect(() => {
    calculateStats();
  }, [tasks, companyProfile]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyAPI.getProfile();
      if (response.data.success) {
        setCompanyProfile(response.data.data.company);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let completion = 0;
    if (companyProfile) {
      if (companyProfile.company_name) completion += 20;
      if (companyProfile.address) completion += 20;
      if (companyProfile.industry) completion += 20;
      if (companyProfile.logo_url) completion += 20;
      if (companyProfile.description) completion += 20;
    }

    // Use real tasks data from Redux store
    const pendingTasksCount = tasks ? tasks.filter(task => !task.completed).length : 0;
    
    // Calculate upcoming deadlines (tasks due in next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlinesCount = tasks ? tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate <= nextWeek && dueDate >= today;
    }).length : 0;

    setStats({
      profileCompletion: completion,
      tasksPending: pendingTasksCount,
      upcomingDeadlines: upcomingDeadlinesCount,
    });
  };

  const QuickActionCard = ({ icon, title, description, buttonText, onClick, color = 'primary' }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Box sx={{ color: `${color}.main`, mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button 
          variant="contained" 
          color={color}
          onClick={onClick}
          fullWidth
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );

  // Calculate completion rate for tasks
  const completionRate = tasks && tasks.length > 0 
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
    : 0;

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.full_name}!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {companyProfile 
            ? `Ready to manage ${companyProfile.company_name}?` 
            : 'Complete your company profile to get started.'
          }
        </Typography>
        {tasks && tasks.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ fontSize: 20 }} />
            <Typography variant="body2">
              Task Completion: {completionRate}% ({tasks.filter(task => task.completed).length}/{tasks.length} tasks done)
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Profile Completion
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.profileCompletion}%
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.profileCompletion} 
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.profileCompletion === 100 ? 'Profile complete! 🎉' : 'Complete your company profile'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Pending Tasks
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.tasksPending}
                  </Typography>
                </Box>
                <Assignment color="warning" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.tasksPending === 0 ? 'All tasks completed! 🎉' : 'Tasks need your attention'}
              </Typography>
              {tasks && tasks.length > 0 && (
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  color="success"
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Upcoming Deadlines
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.upcomingDeadlines}
                  </Typography>
                </Box>
                <CalendarToday color="info" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.upcomingDeadlines === 0 
                  ? 'No upcoming deadlines' 
                  : `${stats.upcomingDeadlines} deadline(s) this week`
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={4}>
          <QuickActionCard
            icon={<Business sx={{ fontSize: 40 }} />}
            title="Company Profile"
            description={companyProfile ? "Update your company information" : "Complete your company profile setup"}
            buttonText={companyProfile ? "Update Profile" : "Setup Profile"}
            onClick={() => navigate('/company-profile')}
            color={companyProfile ? "success" : "primary"}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <QuickActionCard
            icon={<Assignment sx={{ fontSize: 40 }} />}
            title="Tasks"
            description="View and manage your pending tasks and activities"
            buttonText="View Tasks"
            onClick={() => navigate('/tasks')}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <QuickActionCard
            icon={<People sx={{ fontSize: 40 }} />}
            title="Team Members"
            description="Manage your team members and their permissions"
            buttonText="Manage Team"
            onClick={() => navigate('/settings')}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Account created successfully" 
                  secondary="Just now" 
                />
              </ListItem>
              {companyProfile ? (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Company profile completed" 
                      secondary="Profile is 100% complete" 
                    />
                  </ListItem>
                  {stats.tasksPending === 0 && tasks && tasks.length > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="All tasks completed" 
                        secondary="Great job! All tasks are done" 
                      />
                    </ListItem>
                  )}
                </>
              ) : (
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Complete company profile" 
                    secondary="Required to access all features" 
                  />
                </ListItem>
              )}
              {stats.tasksPending > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${stats.tasksPending} pending task${stats.tasksPending > 1 ? 's' : ''}`} 
                    secondary="Complete your tasks to improve productivity" 
                  />
                </ListItem>
              )}
              {stats.upcomingDeadlines > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${stats.upcomingDeadlines} upcoming deadline${stats.upcomingDeadlines > 1 ? 's' : ''}`} 
                    secondary="Check tasks for due dates" 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                icon={<CheckCircle />} 
                label="Account Verified" 
                color="success" 
                variant="outlined"
                sx={{ mb: 1, width: '100%', justifyContent: 'flex-start' }}
              />
              <Chip 
                icon={companyProfile ? <CheckCircle /> : <Warning />} 
                label={companyProfile ? "Profile Complete" : "Profile Incomplete"} 
                color={companyProfile ? "success" : "warning"}
                variant="outlined"
                sx={{ mb: 1, width: '100%', justifyContent: 'flex-start' }}
              />
              <Chip 
                icon={stats.tasksPending === 0 ? <CheckCircle /> : <Info />} 
                label={stats.tasksPending === 0 ? "All Tasks Done" : `${stats.tasksPending} Tasks Pending`} 
                color={stats.tasksPending === 0 ? "success" : "info"}
                variant="outlined"
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;