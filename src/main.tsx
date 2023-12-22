import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import TopLevelErrorBoundary from './components/TopLevelErrorBoundary'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TopLevelErrorBoundary>
      <App />
    </TopLevelErrorBoundary>
  </React.StrictMode>
)
