const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  fs.writeFileSync(path.join(__dirname, 'client', 'src', file), content);
};

// Customers.jsx
const customersContent = `
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(\`/customers/\${editingId}\`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await api.delete(\`/customers/\${id}\`);
      fetchCustomers();
    }
  };

  const openEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setIsModalOpen(true);
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => { setFormData({ name: '', email: '', phone: '', address: '' }); setEditingId(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Phone</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 font-medium">{c.name}</td>
              <td className="py-3 text-gray-600">{c.email}</td>
              <td className="py-3 text-gray-600">{c.phone}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-blue-500 hover:text-blue-700"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Address</label><input className="w-full p-2 border rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Customers;
`;
write('pages/Customers.jsx', customersContent);

// Invoices.jsx
const invoicesContent = `
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { invoiceNumber: '', customerId: '', date: '', dueDate: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], tax: 0, discount: 0, status: 'Pending' };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([api.get('/invoices'), api.get('/customers')]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(\`/invoices/\${editingId}\`, formData);
      else await api.post('/invoices', formData);
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Error saving invoice'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      await api.delete(\`/invoices/\${id}\`);
      fetchData();
    }
  };

  const openEdit = (invoice) => {
    setFormData(invoice);
    setEditingId(invoice.id);
    setIsModalOpen(true);
  };

  const filtered = invoices.filter(i => i.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

  const getCustomerName = (id) => customers.find(c => c.id == id)?.name || 'Unknown';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search invoices..." className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Create Invoice
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-3">Invoice #</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(i => (
            <tr key={i.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 font-medium">{i.invoiceNumber}</td>
              <td className="py-3 text-gray-600">{getCustomerName(i.customerId)}</td>
              <td className="py-3 text-gray-600">{i.date}</td>
              <td className="py-3 font-bold">\${i.total.toLocaleString()}</td>
              <td className="py-3">
                <span className={\`px-2 py-1 rounded text-xs font-semibold \${i.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}\`}>{i.status}</span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(i)} className="text-blue-500 hover:text-blue-700"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(i.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto py-10">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl my-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Invoice' : 'Create Invoice'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Invoice #</label><input required className="w-full p-2 border rounded" value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer</label>
                  <select required className="w-full p-2 border rounded" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Items</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <input placeholder="Description" required className="flex-1 p-2 border rounded" value={item.description} onChange={e => { const newItems = [...formData.items]; newItems[index].description = e.target.value; setFormData({...formData, items: newItems}); }} />
                    <input type="number" min="1" required className="w-20 p-2 border rounded" value={item.quantity} onChange={e => { const newItems = [...formData.items]; newItems[index].quantity = Number(e.target.value); setFormData({...formData, items: newItems}); }} />
                    <input type="number" step="0.01" required className="w-24 p-2 border rounded" value={item.unitPrice} onChange={e => { const newItems = [...formData.items]; newItems[index].unitPrice = Number(e.target.value); setFormData({...formData, items: newItems}); }} />
                    {formData.items.length > 1 && <button type="button" onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="text-red-500"><Trash2 size={18}/></button>}
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, {description:'', quantity:1, unitPrice:0}]})} className="text-blue-500 text-sm mt-1">+ Add Item</button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Tax (%)</label><input type="number" className="w-full p-2 border rounded" value={formData.tax} onChange={e => setFormData({...formData, tax: Number(e.target.value)})} /></div>
                <div><label className="block text-sm font-medium mb-1">Discount ($)</label><input type="number" className="w-full p-2 border rounded" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Invoices;
`;
write('pages/Invoices.jsx', invoicesContent);

// Payments.jsx
const paymentsContent = `
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ invoiceId: '', amount: '', date: '', method: 'Bank Transfer', status: 'Paid' });

  const fetchData = async () => {
    try {
      const [payRes, invRes] = await Promise.all([api.get('/payments'), api.get('/invoices')]);
      setPayments(payRes.data);
      setInvoices(invRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoice = invoices.find(i => i.id == formData.invoiceId);
      if (!invoice) return alert('Invalid invoice');
      await api.post('/payments', { ...formData, customerId: invoice.customerId, amount: Number(formData.amount) });
      setIsModalOpen(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete payment?')) {
      await api.delete(\`/payments/\${id}\`);
      fetchData();
    }
  };

  const getInvoiceNumber = (id) => invoices.find(i => i.id == id)?.invoiceNumber || id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Payments</h2>
        <button onClick={() => { setFormData({ invoiceId: '', amount: '', date: '', method: 'Bank Transfer', status: 'Paid' }); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Record Payment
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-3">Invoice</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Method</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 font-medium">{getInvoiceNumber(p.invoiceId)}</td>
              <td className="py-3 text-gray-600">{p.date}</td>
              <td className="py-3 font-bold">\${p.amount.toLocaleString()}</td>
              <td className="py-3 text-gray-600">{p.method}</td>
              <td className="py-3">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">{p.status}</span>
              </td>
              <td className="py-3">
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice</label>
                  <select required className="w-full p-2 border rounded" value={formData.invoiceId} onChange={e => {
                    const inv = invoices.find(i => i.id == e.target.value);
                    setFormData({...formData, invoiceId: e.target.value, amount: inv ? inv.total : ''});
                  }}>
                    <option value="">Select Invoice</option>
                    {invoices.filter(i => i.status !== 'Paid').map(i => (
                      <option key={i.id} value={i.id}>{i.invoiceNumber} - \${i.total}</option>
                    ))}
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Amount</label><input type="number" required className="w-full p-2 border rounded" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Method</label>
                  <select className="w-full p-2 border rounded" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payments;
`;
write('pages/Payments.jsx', paymentsContent);

// Reports.jsx
const reportsContent = `
import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/dashboard'); // Reuse dashboard data for summary
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchReports();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">\${data.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <p className="text-2xl font-bold">{data.totalInvoices}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Paid Invoices</p>
            <p className="text-2xl font-bold text-blue-600">{data.paidInvoices}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Pending Invoices</p>
            <p className="text-2xl font-bold text-orange-600">{data.pendingInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Export Reports</h2>
        <p className="text-gray-600 mb-4">Download your data as CSV for accounting purposes.</p>
        <div className="flex gap-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Export Invoices</button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Export Payments</button>
        </div>
      </div>
    </div>
  );
};
export default Reports;
`;
write('pages/Reports.jsx', reportsContent);

console.log('Pages generated.');
