import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link as RouterLink } from 'react-router-dom'
import './index.css' // primeiro: define a ordem das camadas CSS
import { Theme } from '@astryxdesign/core/theme'
import { LinkProvider } from '@astryxdesign/core/Link'
import { themes, defaultThemeSlug } from './astryx-themes'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'

// Faz os links do Astryx (ex.: <Button href>) navegarem pelo React Router, sem recarregar a página.
// eslint-disable-next-line react-refresh/only-export-components
const AppLink = ({ href, to, ...props }) => <RouterLink to={to ?? href} {...props} />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Theme theme={themes[defaultThemeSlug]} mode="dark">
        <LinkProvider component={AppLink}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LinkProvider>
      </Theme>
    </BrowserRouter>
  </StrictMode>,
)
