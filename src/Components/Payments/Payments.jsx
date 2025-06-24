import { useEffect, useState } from 'react';
import { getAllSales } from '../../services/salesService';
import './Payments.css';

const Payments = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        (async () => setSales(await getAllSales()))();
    }, []);

    const today = new Date().toISOString().split('T')[0];
    const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
    const todaysRevenue = sales
        .filter(s => s.date === today)
        .reduce((acc, s) => acc + s.amount, 0);

    const modes = sales.reduce((acc, s) => {
        const mode = s.paymentMode || 'Other';
        acc[mode] = (acc[mode] || 0) + s.amount;
        return acc;
    }, {});

    return (
        <div className="payments-page">
            <h2>Payments</h2>

            <div className="summary-row">
                <div className="summary-card">Total Revenue: ₹{totalRevenue}</div>
                <div className="summary-card">Today's Revenue: ₹{todaysRevenue}</div>
                <div className="summary-card">
                    <h4>Payment Methods</h4>
                    <ul>
                        {Object.entries(modes).map(([mode, amt]) => (
                            <li key={mode}>{mode}: ₹{amt}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <h3>Payment Records</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(s => (
                        <tr key={s.id}>
                            <td>{s.date}</td>
                            <td>{s.customer}</td>
                            <td>
                                {s.items.map((item, i) => (
                                    <div key={i}>{item.product} × {item.quantity}</div>
                                ))}
                            </td>
                            <td>₹{s.amount}</td>
                            <td>{s.paymentMode}</td>
                            <td>{s.amount >= 0 ? 'Paid' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payments;
