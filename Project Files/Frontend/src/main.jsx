import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import App from './App.jsx'; // Updated to import App.jsx
import store from './redux/store.js'; // Import your Redux store
import './index.css'; // Your global CSS file

// Get the root element from your HTML (typically index.html)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your React application
root.render(
  <React.StrictMode>
    {/* The Redux Provider makes the Redux store available to any nested components */}
    <Provider store={store}>
      {/* BrowserRouter enables client-side routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
