import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LabAuthProvider } from './context/LabAuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

// Eslatma: React.StrictMode olib tashlandi — u dev rejimida useEffect'ni
// ikki marta chaqirib, har so'rovni 2 marta yuborardi.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ThemeProvider>
      <AuthProvider>
        <LabAuthProvider>
          <App />
        </LabAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
