import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [
    {
      id: 1,
      title: 'Complete company profile setup',
      description: 'Fill out all required company information',
      completed: false,
      priority: 'high',
      category: 'profile'
    },
    {
      id: 2,
      title: 'Upload company logo and banner',
      description: 'Add professional images to your company profile',
      completed: false,
      priority: 'medium',
      category: 'profile'
    },
    {
      id: 3,
      title: 'Verify company information',
      description: 'Review and confirm all company details are accurate',
      completed: false,
      priority: 'low',
      category: 'verification'
    }
  ],
  loading: false,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    toggleTaskCompletion: (state, action) => {
      const taskId = action.payload
      const task = state.tasks.find(task => task.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
    },
    deleteTask: (state, action) => {
      const taskId = action.payload
      state.tasks = state.tasks.filter(task => task.id !== taskId)
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { 
  setTasks, 
  addTask, 
  toggleTaskCompletion, 
  deleteTask, 
  updateTask, 
  setLoading 
} = tasksSlice.actions

export default tasksSlice.reducer