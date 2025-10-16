import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import companySlice from './slices/companySlice'
import tasksSlice from './slices/tasksSlice' // Add this import

export const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
    tasks: tasksSlice, // Add tasks slice
  },
})