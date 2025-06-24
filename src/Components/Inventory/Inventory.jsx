import { useEffect, useState } from 'react';
import {
    getAllProducts,
    deleteProduct,
    updateProduct,
    createProduct
} from '../../services/productService';
import './Inventory.css';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchInventory = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setEditForm({ ...product });
    };

    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [id]: ['costPrice', 'sellingPrice', 'stock'].includes(id)
                ? Number(value)
                : value,
        }));
    };

    const handleEditSubmit = async (id) => {
        await updateProduct(id, editForm);
        setEditingId(null);
        fetchInventory();
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure?");
        if (!confirm) return;
        await deleteProduct(id);
        fetchInventory();
    };

    const getStatus = (stock) => {
        if (stock <= 2) return 'Critical';
        if (stock <= 5) return 'Low';
        return 'OK';
    };

    const filtered = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(p.stock);
        const matchesFilter = filter === 'All' || filter === status;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="inventory-page">
            <h2>Inventory</h2>

            <div className="inventory-summary">
                <div>Total Items: {products.length}</div>
                <div>Low Stock: {products.filter(p => p.stock <= 5).length}</div>
                <div>Critical Stock: {products.filter(p => p.stock <= 2).length}</div>
                <div>
                    Inventory Value: ₹
                    {products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0)}
                </div>
            </div>

            <div className="inventory-filters">
                <input
                    type="text"
                    placeholder="Search Inventory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Critical">Critical</option>
                    <option value="OK">Normal</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((product) => (
                        <tr key={product.id}>
                            {editingId === product.id ? (
                                <>
                                    <td>
                                        <input
                                            id="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id="category"
                                            value={editForm.category}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id="costPrice"
                                            type="number"
                                            value={editForm.costPrice}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id="sellingPrice"
                                            type="number"
                                            value={editForm.sellingPrice}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id="stock"
                                            type="number"
                                            value={editForm.stock}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>{getStatus(editForm.stock)}</td>
                                    <td>
                                        <button onClick={() => handleEditSubmit(product.id)}>
                                            Save
                                        </button>
                                        <button onClick={() => setEditingId(null)}>
                                            Cancel
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.costPrice}</td>
                                    <td>₹{product.sellingPrice}</td>
                                    <td>{product.stock}</td>
                                    <td>{getStatus(product.stock)}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(product)}>Edit</button>
                                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
