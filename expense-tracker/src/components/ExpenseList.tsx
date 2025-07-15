
// src/components/ExpenseList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Expense {
  name: string;
  expense_date: string;
  amount: number;
  description: string;
  expense_category: string;
  user: string;
}

interface ExpenseListProps {
  refreshTrigger: number;

}

const ExpenseList: React.FC<ExpenseListProps> = ({ refreshTrigger }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Still use /api/resource for GET list, as it's working and efficient for reads
      const apiUrl = '/api/resource/Expense';
      const fields = JSON.stringify([
        'name',
        'expense_date',
        'amount',
        'description',
        'expense_category',
        'user',
      ]);
      const response = await axios.get(`${apiUrl}?fields=${fields}`);
      setExpenses(response.data.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to load expenses: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError('Failed to load expenses. Network error or unexpected response.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const handleDelete = async (expenseName: string) => {
    if (!window.confirm(`Are you sure you want to delete expense "${expenseName}"?`)) {
      return;
    }
    setLoading(true);
    setError(null);

    


    try {
      // Call the custom whitelisted method for deleting an expense
      // Pass 'name' as part of the payload
      await axios.delete('/api/resource/Expense/'+ expenseName, {
        headers: {
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
      });
      console.log(`Expense ${expenseName} deleted.`);
      fetchExpenses(); // Re-fetch the list after deletion
    } catch (err) {
      console.error('Error deleting expense:', err);
      if (axios.isAxiosError(err) && err.response) {
        const serverMessage = err.response.data.message || err.response.statusText;
        setError(`Failed to delete expense: ${serverMessage}`);
      } else {
        setError('Failed to delete expense. Network error or unexpected response.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
      <h2>Expense List</h2>
      {loading && <p>Loading expenses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && expenses.length === 0 ? (
        <p>No expenses found. Add a new one above!</p>
      ) : (
        !loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>User</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.name}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{expense.expense_date.split(' ')[0]}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{expense.amount.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{expense.expense_category}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{expense.description}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{expense.user}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDelete(expense.name)}
                      disabled={loading}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading) ? 'not-allowed' : 'pointer',
                        opacity: (loading) ? 0.7 : 1,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default ExpenseList;