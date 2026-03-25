import React from 'react';
import { ReceiptProvider } from './context/ReceiptContext';
import AddReceiptForm from './components/AddReceiptForm/AddReceiptForm';
import ReceiptList from './components/ReceiptList/ReceiptList';
import Statistics from './components/Statistics/Statistics';

function App() {
  return (
    <ReceiptProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Учет расходов</h1>
        <AddReceiptForm />
        <ReceiptList />
        
        <Statistics />
      </div>
    </ReceiptProvider>
  );
}

export default App;
