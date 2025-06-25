import { Routes, Route, Navigate } from 'react-router-dom';
import BillForm from './Components/BillForm.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Header from './Components/Header/Header.jsx';
import Inventory from './Components/Inventory/Inventory.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Payments from './Components/Payments/Payments.jsx';
import Product from './Components/Product/Prouducts.jsx';
import Sales from './Components/Sales/Sales.jsx';

import PrivateRoute from './Components/PrivateRoutes.jsx';
import Login from './Components/Login/Login.jsx';

const App = () => {

  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Product /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/billform" element={<PrivateRoute><BillForm /></PrivateRoute>} />
        <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default App;
