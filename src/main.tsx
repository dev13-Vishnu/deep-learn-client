import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store/index';
import { hydrateAuth } from './store/auth/authSlice';
import { NotificationProvider } from './notifications/Notificationprovider';


store.dispatch(hydrateAuth());

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </Provider>,
);