import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; //
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx'; // Import Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthContextProvider PHẢI bọc BÊN NGOÀI 
      BẤT KỲ component nào sử dụng useAuth()
    */}
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
);