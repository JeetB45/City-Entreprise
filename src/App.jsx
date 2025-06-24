import { Routes, Route, Navigate } from 'react-router-dom';
import BillForm from './Components/BillForm.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Header from './Components/Header/Header.jsx';
import Inventory from './Components/Inventory/Inventory.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Payments from './Components/Payments/Payments.jsx';
import Product from './Components/Product/Prouducts.jsx';
import Sales from './Components/Sales/Sales.jsx';


const App = () => {

  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<BillForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Product />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/billform" element={<BillForm />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </>
  );
};

export default App;
