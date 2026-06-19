import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CommandoProvider } from './context/CommandoContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommandoProvider>
      <App />
    </CommandoProvider>
  </StrictMode>,
);

