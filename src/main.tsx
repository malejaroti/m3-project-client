// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { AuthWrapper } from './context/auth.context.tsx';

// Import Roboto font weights
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </BrowserRouter>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
);
