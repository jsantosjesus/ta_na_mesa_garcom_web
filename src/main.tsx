import ReactDOM from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { AuthProvider } from './app/context/auth.tsx'
import { FirebaseProvider } from './app/context/firebaseAppContext.tsx'

import './app/styles/main.sass'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <FirebaseProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </FirebaseProvider>
)
