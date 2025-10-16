import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  Pending,
  Assignment,
  CalendarToday,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTaskCompletion, addTask, deleteTask } from '../store/slices/tasksSlice';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const handleToggleCompletion = (taskId) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: false,
      priority: newTask.priority,
      category: 'general'
    };

    dispatch(addTask(task));
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Sort pending tasks by priority and due date
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    // First sort by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    // Then sort by due date (sooner first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
        Tasks Management
      </Typography>

      <Grid container spacing={3}>
        {/* Add New Task */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Task
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Task Title *"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  multiline
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTask.priority}
                    label="Priority"
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleAddTask}
                  startIcon={<Add />}
                  disabled={!newTask.title.trim()}
                  fullWidth
                >
                  Add Task
                </Button>
              </Box>
              
              {/* Stats */}
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task Summary:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Tasks:</Typography>
                    <Chip label={tasks.length} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Pending:</Typography>
                    <Chip label={pendingTasks.length} color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Completed:</Typography>
                    <Chip label={completedTasks.length} color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Completion Rate:</Typography>
                    <Chip 
                      label={`${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%`} 
                      color="primary" 
                      size="small" 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks List */}
        <Grid item xs={12} md={8}>
          {/* Pending Tasks */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Pending sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">
                  Pending Tasks ({pendingTasks.length})
                </Typography>
              </Box>

              {pendingTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    No pending tasks!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Great job! You've completed all your tasks. 🎉
                  </Typography>
                </Box>
              ) : (
                <List>
                  {sortedPendingTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: isOverdue(task.dueDate) ? 'error.light' : 'background.paper',
                        '&:hover': {
                          backgroundColor: isOverdue(task.dueDate) ? 'error.light' : 'action.hover',
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleCompletion(task.id)}
                          color="success"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" component="span">
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.priority}
                              size="small"
                              color={getPriorityColor(task.priority)}
                            />
                            {task.dueDate && (
                              <Chip
                                icon={<CalendarToday />}
                                label={formatDate(task.dueDate)}
                                size="small"
                                variant="outlined"
                                color={
                                  isOverdue(task.dueDate) ? 'error' : 
                                  isDueSoon(task.dueDate) ? 'warning' : 'default'
                                }
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                            {isOverdue(task.dueDate) && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                ⚠️ This task is overdue!
                              </Typography>
                            )}
                            {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && (
                              <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                                ⏰ Due soon!
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Completed Tasks ({completedTasks.length})
                </Typography>
              </Box>

              {completedTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Assignment sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    No completed tasks yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start checking off tasks to see them here!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {completedTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'success.light',
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: 'success.light',
                        opacity: 0.8,
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleCompletion(task.id)}
                          color="success"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle1" 
                              component="span"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.priority}
                              size="small"
                              color={getPriorityColor(task.priority)}
                            />
                            {task.dueDate && (
                              <Chip
                                icon={<CalendarToday />}
                                label={formatDate(task.dueDate)}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {task.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tasks;