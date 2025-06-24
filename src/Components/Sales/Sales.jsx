import { useEffect, useState } from 'react';
import { getAllBills } from '../../services/BillForm';
import './Sales.css';

const Sales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllBills(); // This reads from 'bills' collection
            setSales(data);
        };
        fetchData();
    }, []);

    const totalSales = sales.length;
    const today = new Date().toISOString().split('T')[0];
    const todaysSales = sales.filter(s => s.date === today);
    const todaysRevenue = todaysSales.reduce((acc, s) => acc + s.total, 0);
    const unitsSold = sales.reduce((acc, bill) =>
        acc + bill.products?.reduce((sum, item) => sum + item.quantity, 0), 0
    );

    return (
        <div className="sales-page">
            <h2>Sales</h2>

            <div className="sales-summary">
                <div>Total Sales: {totalSales}</div>
                <div>Today's Revenue: ₹{todaysRevenue}</div>
                <div>Units Sold: {unitsSold}</div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.date || '-'}</td>
                            <td>{sale.name || '-'}</td>
                            <td>
                                {sale.products?.map((item, idx) => (
                                    <div key={idx}>
                                        {item.product} × {item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td>₹{sale.total || 0}</td>
                            <td>{sale.paymentMode || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sales;
