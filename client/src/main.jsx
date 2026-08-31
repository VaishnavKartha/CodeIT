import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import RoomContext from './context/RoomContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <AuthContext>
   <RoomContext>
    <App />
   </RoomContext>
  </AuthContext>
  </BrowserRouter>
  </StrictMode>,
)
