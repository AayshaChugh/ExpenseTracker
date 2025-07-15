
// src/components/ExpenseForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
  // currentUser is no longer needed as a prop for the backend 'user' field,
  // but we keep csrfToken as it's still needed for the POST request.
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onExpenseAdded}) => {
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    expense_category: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.expense_date || !formData.amount || !formData.expense_category) {
      setError('Date, Amount, and Category are required.');
      setLoading(false);
      return;
    }

    
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        // The 'user' field is now set automatically by the backend method (frappe.session.user)
        // So, we do NOT send 'user: currentUser' from the frontend here.
      };

      // Call the custom whitelisted method for creating an expense
      const response = await axios.post('/api/resource/Expense', payload, {
        headers: {
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
      });

      console.log('Expense added:', response); // Frappe API returns name or message
      setSuccess('Expense added successfully!');
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        expense_category: '',
      });
      onExpenseAdded();
    } catch (err) {
      console.error('Error adding expense:', err);
      if (axios.isAxiosError(err) && err.response) {
        // Frappe error responses for /api/method often have a 'message' field directly
        const serverMessage = err.response.data.message || err.response.statusText;
        setError(`Failed to add expense: ${serverMessage}`);
      } else {
        setError('Failed to add expense. Network error or unexpected response.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '30px' }}>
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="expense_date">Date:</label>
          <input
            type="date"
            id="expense_date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="expense_category">Category:</label>
          <select
            id="expense_category"
            name="expense_category"
            value={formData.expense_category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Category</option>
            <option value="1">Food</option>
            <option value="2">Transport</option>
            <option value="3">Utilities</option>
            <option value="4">Rent</option>
            <option value="5">Shopping</option>
           
          </select>
        </div>
        <div>
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px' }}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '10px',
          }}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default ExpenseForm;