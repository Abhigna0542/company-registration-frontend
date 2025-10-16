import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline' // Add this back

import App from './App.jsx'
import { store } from './store/store.js'

import './index.css'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff', // Ensure white background
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* This provides clean Material-UI baseline */}
          <App />
          <ToastContainer />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)