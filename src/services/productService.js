import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const productRef = collection(db, 'products');

export const getAllProducts = async () => {
    const snapshot = await getDocs(productRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteProduct = async (id) => {
    return await deleteDoc(doc(db, 'products', id));
};

export const updateProduct = async (id, data) => {
    return await updateDoc(doc(db, 'products', id), data);
};

export const createProduct = async (data) => {
    return await addDoc(productRef, data);
};
