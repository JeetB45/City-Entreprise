import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../AuthContext.jsx';

const Navbar = () => {
    const { user, signOut } = useAuth();

    return (
        <nav className="navbar">
            <NavLink to="/billform">Billing</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/inventory">Inventory</NavLink>
            <NavLink to="/sales">Sales</NavLink>
            <NavLink to="/payments">Payments</NavLink>
            <button onClick={signOut} className="logout-btn">Logout</button>
        </nav>
    );
};

export default Navbar;
