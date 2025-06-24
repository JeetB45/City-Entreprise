import { useState, useEffect } from "react";
import './BillForm.css';
import {
    createBill,
    getAllBills,
    updateBill,
    deleteBill,
} from '../services/BillForm';
import { getAllProducts } from '../services/productService';

const BillForm = () => {
    const [billData, setBillData] = useState({
        name: '',
        phone: '',
        products: [{ product: '', quantity: 1, price: 0 }],
        date: '',
        amountPaid: 0,
        paymentMode: 'Cash',
    });

    const [productList, setProductList] = useState([]);
    const [bills, setBills] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const all = await getAllProducts();
            const inStock = all.filter(p => p.stock > 0);
            setProductList(inStock);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const allBills = await getAllBills();
            setBills(allBills);
        } catch (err) {
            console.error('Error fetching bills:', err);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setBillData((prev) => ({
            ...prev,
            [id]: id === 'amountPaid' ? Number(value) : value,
        }));
    };

    const handleProductChange = (index, field, value) => {
        const updated = [...billData.products];
        updated[index][field] = ['quantity', 'price'].includes(field) ? Number(value) : value;
        setBillData((prev) => ({ ...prev, products: updated }));
    };

    const addProductRow = () => {
        setBillData((prev) => ({
            ...prev,
            products: [...prev.products, { product: '', quantity: 1, price: 0 }],
        }));
    };

    const removeProductRow = (index) => {
        const updated = billData.products.filter((_, i) => i !== index);
        setBillData((prev) => ({ ...prev, products: updated }));
    };

    const total = billData.products.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateBill(editingId, billData);
                alert('Bill updated!');
            } else {
                await createBill(billData);
                alert('Bill saved!');
            }
            setEditingId(null);
            setBillData({
                name: '',
                phone: '',
                products: [{ product: '', quantity: 1, price: 0 }],
                date: '',
                amountPaid: 0,
                paymentMode: 'Cash',
            });
            fetchBills();
        } catch (err) {
            console.error('Error saving bill:', err);
        }
    };

    const handleEdit = (bill) => {
        setBillData({
            name: bill.name,
            phone: bill.phone,
            products: bill.products,
            date: bill.date,
            amountPaid: bill.amountPaid,
            paymentMode: bill.paymentMode,
        });
        setEditingId(bill.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bill?')) return;
        try {
            await deleteBill(id);
            fetchBills();
        } catch (err) {
            console.error('Error deleting bill:', err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2 className="title">Create Bill</h2>

                <div className="row">
                    <div className="field">
                        <label>Customer Name</label>
                        <input type="text" id="name" value={billData.name} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Phone Number</label>
                        <input type="text" id="phone" value={billData.phone} onChange={handleChange} required />
                    </div>
                </div>

                <label>Products</label>
                {billData.products.map((prod, idx) => (
                    <div className="product-row" key={idx}>
                        <div className="product-field">
                            <label>Product</label>
                            <select
                                value={prod.product}
                                onChange={(e) => handleProductChange(idx, 'product', e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Product</option>
                                {productList.map((p) => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="product-field short">
                            <label>Quantity</label>
                            <input
                                type="number"
                                value={prod.quantity}
                                min={1}
                                onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                                required
                            />
                        </div>
                        <div className="product-field short">
                            <label>Price</label>
                            <input
                                type="number"
                                value={prod.price}
                                min={0}
                                onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
                                required
                            />
                        </div>
                        {billData.products.length > 1 && (
                            <button type="button" className="remove-btn" onClick={() => removeProductRow(idx)}>❌</button>
                        )}
                        {idx === billData.products.length - 1 && (
                            <button type="button" className="add-btn-inline" onClick={addProductRow}>+ Add Product</button>
                        )}
                    </div>
                ))}

                {/* <button type="button" className="add-btn" onClick={addProductRow}>+ Add Product</button> */}

                <div className="row">
                    <div className="field">
                        <label>Date</label>
                        <input type="date" id="date" value={billData.date} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Amount Paid</label>
                        <input type="number" id="amountPaid" value={billData.amountPaid} onChange={handleChange} min={0} required />
                    </div>
                    <div className="field">
                        <label>Payment Mode</label>
                        <select id="paymentMode" value={billData.paymentMode} onChange={handleChange}>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Net Banking">Net Banking</option>
                        </select>
                    </div>
                </div>

                <div className="footer">
                    <div className="total">Total: ₹{total}</div>
                    <button type="submit" className="save-btn">{editingId ? 'Update Bill' : 'Save Bill'}</button>
                </div>
            </form>

            <hr style={{ margin: "30px 0" }} />

            <h2>All Bills</h2>
            <div style={{ overflowX: "auto" }}>
                <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.length === 0 ? (
                            <tr><td colSpan="10" align="center">No bills yet</td></tr>
                        ) : (
                            bills.map((bill) => (
                                <tr key={bill.id}>
                                    <td>{bill.name}</td>
                                    <td>{bill.phone}</td>
                                    <td>{bill.products?.map((p, i) => <div key={i}>{p.product}</div>)}</td>
                                    <td>{bill.products?.map((p, i) => <div key={i}>{p.quantity}</div>)}</td>
                                    <td>{bill.products?.map((p, i) => <div key={i}>₹{p.price}</div>)}</td>
                                    <td>{bill.total}</td>
                                    <td>{bill.amountPaid}</td>
                                    <td>{bill.paymentMode}</td>
                                    <td>{bill.date}</td>
                                    <td>
                                        <button className="edit" onClick={() => handleEdit(bill)}>Edit</button>
                                        <button className="delete" onClick={() => handleDelete(bill.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default BillForm;
