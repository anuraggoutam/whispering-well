import { StrictMode } from 'react';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WebSocketProvider } from './context/webSocket';
import { WebSocketUserProvider } from './context/webSocketUser';
import { WebSocketCasinoProvider } from './context/webSocketCasino';
import './index.css';
import reportWebVitals, { consoleReporter } from './reportWebVitals';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="suspense-loading">
          <img src="/imgs/logo.png" width={200} />
        </div>
      }
    >
      <Provider store={store}>
        <WebSocketProvider>
          <WebSocketUserProvider>
            <WebSocketCasinoProvider>
              <App />
            </WebSocketCasinoProvider>
          </WebSocketUserProvider>
        </WebSocketProvider>
      </Provider>
    </Suspense>
  </StrictMode>
);

// Enhanced logging with ratings
reportWebVitals(consoleReporter);
