import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '2rem' }}>
        TENNsational - Site Under Maintenance
      </h1>
      <p style={{ textAlign: 'center' }}>
        We'll be back online shortly. For inquiries: Admin@tennsational.com
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
