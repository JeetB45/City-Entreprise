import { useEffect, useState } from 'react';
import { getAllSales } from '../../services/salesService';
import { getAllProducts } from '../../services/productService';
import { Line, Pie } from 'react-chartjs-2';
import './Dashboard.css';
import 'chart.js/auto';

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            setSales(await getAllSales());
            setProducts(await getAllProducts());
        })();
    }, []);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
    const month = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = sales
        .filter(s => s.date.startsWith(month))
        .reduce((acc, s) => acc + s.amount, 0);

    const activeProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const uniqueCustomers = [...new Set(sales.map(s => s.customer))].length;
    const pendingPayments = sales.filter(s => s.amount < s.amountPaid).length; // compare properly

    const salesByMonth = sales.reduce((acc, s) => {
        const m = s.date.slice(0, 7);
        acc[m] = (acc[m] || 0) + s.amount;
        return acc;
    }, {});
    const chartData = {
        labels: Object.keys(salesByMonth),
        datasets: [{ label: 'Revenue', data: Object.values(salesByMonth), backgroundColor: '#3b82f6' }],
    };

    const categoryCount = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(categoryCount),
        datasets: [{ data: Object.values(categoryCount), backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'] }],
    };

    return (
        <div className="dashboard-page">
            <h2>Dashboard</h2>
            <div className="kpi-row">
                <div className="kpi-card">Total Sales: {totalSales}</div>
                <div className="kpi-card">Monthly Revenue: ₹{monthlyRevenue}</div>
                <div className="kpi-card">Active Products: {activeProducts}</div>
            </div>
            <div className="kpi-row">
                <div className="kpi-card">Low Stock Items: {lowStockCount}</div>
                <div className="kpi-card">Customers: {uniqueCustomers}</div>
                <div className="kpi-card">Pending Payments: {pendingPayments}</div>
            </div>

            <div className="charts-row">
                <div className="chart">
                    <h4>Monthly Sales Trend</h4>
                    <Line data={chartData} />
                </div>
                <div className="chart">
                    <h4>Product Categories</h4>
                    <Pie data={pieData} />
                </div>
            </div>

            <div className="charts-row">
                <div className="low-stock">
                    <h4>Low Stock Alerts</h4>
                    <ul>
                        {products.filter(p => p.stock <= 5).map(p => (
                            <li key={p.id}>{p.name} ({p.stock})</li>
                        ))}
                    </ul>
                </div>
                <div className="recent-sales">
                    <h4>Recent Sales</h4>
                    <ul>
                        {[...sales].slice(-5).reverse().map(s => (
                            <li key={s.id}>{s.date} – {s.customer} – ₹{s.amount}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
