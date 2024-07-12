import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './app/context/auth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
