import { useEffect, useState } from 'react';
import { getAllPayments } from '../../services/paymentService'; // ⬅️ updated
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
            <table className="payments-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p.id}>
                            <td>{p.date}</td>
                            <td>{p.customer}</td>
                            <td>₹{p.amount}</td>
                            <td>{p.paymentMode}</td>
                            <td>{p.amount >= 0 ? 'Paid' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payments;
