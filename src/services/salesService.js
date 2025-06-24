import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const salesRef = collection(db, 'sales');

export const addSale = async (saleData) => {
    return await addDoc(salesRef, {
        ...saleData,
        createdAt: serverTimestamp(),
    });
};

export const getAllSales = async () => {
    const snapshot = await getDocs(salesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
