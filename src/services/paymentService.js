import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const paymentsRef = collection(db, 'payments');

export const getAllPayments = async () => {
    const snapshot = await getDocs(paymentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};