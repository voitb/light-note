import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { themeService } from './services/themeService'

// Initialize theme from user store on app load
themeService.initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="w-full h-full">
      <App />
    </div>
  </StrictMode>,
)
