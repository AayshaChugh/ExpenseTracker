
// src/App.tsx
import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './index.css'; // Assuming your global styles are here



const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>Expense Trackerr </h1>
      <ExpenseForm onExpenseAdded={handleExpenseAdded}  />
      <ExpenseList refreshTrigger={refreshTrigger}  />
    </div>
  );
};

// Modify index.tsx to pass props
export default App;