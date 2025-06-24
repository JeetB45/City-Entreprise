import './Header.css';
import logo from '../../assets/Logo.png'
const Header = () => {
    return (
        <header className="app-header">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="company-name">City Enterprise</h1>
        </header>
    );
};

export default Header;