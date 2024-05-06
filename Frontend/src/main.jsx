import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import App from './App.jsx';
import './css/index.css';
import Login from './Login.jsx';
import PrivateRoutes from './utils/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext'
import SignUp from './SignUp.jsx';
import UploadItem from './UploadItem.jsx';
import ItemDetail from './ItemDetail.jsx';
import CategoryPage from './CategoryPage.jsx';
import UpdateProfile from './UpdateProfile.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/item/:slug" element={<ItemDetail />} />
        <Route path="/category/:item_category_name" element={<CategoryPage />} />
        
       <Route element={<PrivateRoutes/>}>
        <Route path="/upload" element={<UploadItem/>} />
        <Route path="/update-profile" element={<UpdateProfile/>} />
       </Route>
        
      </Routes>
    </BrowserRouter></AuthProvider>
  </React.StrictMode>
);
