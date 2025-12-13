import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// ✅ Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// ✅ Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// (optional) custom styles
// import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
