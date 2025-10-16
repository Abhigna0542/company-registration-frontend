import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  companyProfile: null,
  loading: false,
  error: null,
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyProfile: (state, action) => {
      state.companyProfile = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateCompanyProfile: (state, action) => {
      state.companyProfile = { ...state.companyProfile, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { 
  setCompanyProfile, 
  setLoading, 
  setError, 
  updateCompanyProfile, 
  clearError 
} = companySlice.actions
export default companySlice.reducer