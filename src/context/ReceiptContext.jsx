import React, { createContext, useState, useEffect } from 'react';


export const ReceiptContext = createContext();


export const ReceiptProvider = ({ children }) => {

  const [receipts, setReceipts] = useState(() => {

    const saved = localStorage.getItem('receipts');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }, [receipts]);


  const addReceipt = (receipt) => {
    setReceipts(prev => [...prev, receipt]);
  };


  const deleteReceipt = (id) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };


  const editReceipt = (id, updatedReceipt) => {
    setReceipts(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updatedReceipt } : r))
    );
  };

  return (
    <ReceiptContext.Provider value={{ receipts, addReceipt, deleteReceipt, editReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};
