import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';
import { getAllProducts, updateProduct } from './productService';
import { query, where } from 'firebase/firestore';

// Firestore references
const billsRef = collection(db, 'bills');
const salesRef = collection(db, 'sales');
const paymentsRef = collection(db, 'payments');

// 🟢 Create a bill, update stock, record sales & payments
export const createBill = async (billData) => {
    const total = Array.isArray(billData.products)
        ? billData.products.reduce((acc, item) => acc + item.quantity * item.price, 0)
        : 0;

    // Step 1: Update stock
    const allProducts = await getAllProducts();
    for (const item of billData.products) {
        const product = allProducts.find(p => p.name === item.product);
        if (product) {
            await updateProduct(product.id, {
                ...product,
                stock: product.stock - item.quantity,
            });
        }
    }

    // Step 2: Create bill
    const billDoc = await addDoc(billsRef, {
        ...billData,
        total,
        createdAt: serverTimestamp(),
    });

    // Step 3: Create sales record
    await addDoc(salesRef, {
        billId: billDoc.id,
        date: billData.date,
        customer: billData.name,
        items: billData.products,
        amount: total,
        status: 'Completed',
        createdAt: serverTimestamp(),
    });

    // Step 4: Create payment record
    await addDoc(paymentsRef, {
        billId: billDoc.id,
        customer: billData.name,
        amount: billData.amountPaid,
        paymentMode: billData.paymentMode,
        date: billData.date,
        createdAt: serverTimestamp(),
    });

    return billDoc;
};

// 🟡 Get all bills
export const getAllBills = async () => {
    const snapshot = await getDocs(billsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔵 Update a bill
export const updateBill = async (id, billData) => {
    const total = Array.isArray(billData.products)
        ? billData.products.reduce((acc, item) => acc + item.quantity * item.price, 0)
        : 0;

    return await updateDoc(doc(db, 'bills', id), {
        ...billData,
        total,
        updatedAt: serverTimestamp(),
    });
};

// 🔴 Delete a bill
export const deleteBill = async (id) => {
    const billRef = doc(db, 'bills', id);
    const billSnap = await getDoc(billRef);

    if (!billSnap.exists()) {
        throw new Error('Bill not found');
    }

    const billData = billSnap.data();

    // Step 1: Restore inventory
    const allProducts = await getAllProducts();
    for (const item of billData.products || []) {
        const product = allProducts.find(p => p.name === item.product);
        if (product) {
            await updateProduct(product.id, {
                ...product,
                stock: product.stock + item.quantity,
            });
        }
    }

    // Step 2: Delete related sales
    const saleQuery = query(salesRef, where('billId', '==', id));
    const saleSnap = await getDocs(saleQuery);
    await Promise.all(saleSnap.docs.map(doc => deleteDoc(doc.ref)));

    // Step 3: Delete related payments
    const paymentQuery = query(paymentsRef, where('billId', '==', id));
    const paymentSnap = await getDocs(paymentQuery);
    await Promise.all(paymentSnap.docs.map(doc => deleteDoc(doc.ref)));

    // Step 4: Delete bill
    return await deleteDoc(billRef);
};