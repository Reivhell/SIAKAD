import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ReactLenis } from 'lenis/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Silently intercept and suppress benign Vite WebSocket / HMR failure overlays
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = reason ? (reason.message || String(reason)) : '';
    if (
      reasonStr.toLowerCase().includes('websocket') || 
      reasonStr.toLowerCase().includes('failed to connect') ||
      reasonStr.toLowerCase().includes('closed without opened') ||
      reasonStr.toLowerCase().includes('vite')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.toLowerCase().includes('websocket') || 
      msg.toLowerCase().includes('failed to connect') ||
      msg.toLowerCase().includes('closed without opened') ||
      msg.toLowerCase().includes('vite')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      
        <ReactLenis root>
          <App />
        </ReactLenis>
      
    </QueryClientProvider>
  </StrictMode>,
);
