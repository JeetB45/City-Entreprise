import { useEffect, useState } from 'react';
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} from '../../services/productService';
import './Products.css'; // add styling

const Products = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        category: '',
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
    });
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm({ ...form, [id]: id === 'stock' || id.includes('Price') ? Number(value) : value });
    };

    const fetchProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateProduct(editingId, form);
        } else {
            await addProduct({ ...form, status: 'Active' });
        }
        setForm({ name: '', category: '', costPrice: 0, sellingPrice: 0, stock: 0 });
        setEditingId(null);
        fetchProducts();
    };

    const handleEdit = (prod) => {
        setForm(prod);
        setEditingId(prod.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="products-page">
            <h2>Products</h2>

            <div className="top-bar">
                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="field">
                    <label htmlFor="name">Product Name</label>
                    <input id="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
                </div>

                <div className="field">
                    <label htmlFor="category">Category</label>
                    <input id="category" value={form.category} onChange={handleChange} placeholder="Category" required />
                </div>

                <div className="field">
                    <label htmlFor="costPrice">Cost Price</label>
                    <input id="costPrice" value={form.costPrice} onChange={handleChange} placeholder="Cost Price" type="number" required />
                </div>

                <div className="field">
                    <label htmlFor="sellingPrice">Selling Price</label>
                    <input id="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="Selling Price" type="number" required />
                </div>

                <div className="field">
                    <label htmlFor="stock">Stock</label>
                    <input id="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" required />
                </div>

                <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((prod) => (
                        <tr key={prod.id}>
                            <td>{prod.name}</td>
                            <td>{prod.category}</td>
                            <td>₹{prod.costPrice}</td>
                            <td>₹{prod.sellingPrice}</td>
                            <td>{prod.stock}</td>
                            <td>{prod.status}</td>
                            <td>
                                <button onClick={() => handleEdit(prod)}>Edit</button>
                                <button onClick={() => handleDelete(prod.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
