import { useEffect, useState } from 'react';
import { getAllSales } from '../../services/salesService';
import './Payments.css';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        (async () => {
            const all = await getAllPayments();
            setPayments(all);
        })();
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const todaysRevenue = payments
        .filter(p => p.date === today)
        .reduce((acc, p) => acc + p.amount, 0);

    const modes = payments.reduce((acc, p) => {
        const mode = p.paymentMode || 'Other';
        acc[mode] = (acc[mode] || 0) + p.amount;
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
