import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Search, CheckCircle } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ invoiceId: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', status: 'Paid' });

  const fetchData = async () => {
    try {
      const [payRes, invRes] = await Promise.all([api.get('/payments'), api.get('/invoices')]);
      // Sort payments by date desc
      setPayments(payRes.data.sort((a,b) => new Date(b.date) - new Date(a.date)));
      setInvoices(invRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoice = invoices.find(i => i.id == formData.invoiceId);
      if (!invoice) return alert('Invalid invoice');
      if (Number(formData.amount) <= 0) return alert('Amount must be positive');
      
      await api.post('/payments', { ...formData, customerId: invoice.customerId, amount: Number(formData.amount) });
      setIsModalOpen(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payment record? This will not automatically revert the invoice status.')) {
      await api.delete(`/payments/${id}`);
      fetchData();
    }
  };

  const getInvoiceNumber = (id) => invoices.find(i => i.id == id)?.invoiceNumber || id;
  
  const filtered = payments.filter(p => {
    const invNum = getInvoiceNumber(p.invoiceId).toLowerCase();
    return invNum.includes(search.toLowerCase());
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search payments by Invoice #..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setFormData({ invoiceId: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', status: 'Paid' }); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full md:w-auto justify-center shadow-sm"
        >
          <Plus size={20} /> Record Payment
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Invoice #</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Method</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-blue-50/50 transition-colors">
                <td className="p-4 font-medium text-blue-600">{getInvoiceNumber(p.invoiceId)}</td>
                <td className="p-4 text-gray-600">{p.date}</td>
                <td className="p-4 font-bold text-gray-800">${p.amount.toLocaleString()}</td>
                <td className="p-4 text-gray-600">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{p.method}</span>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-bold w-max">
                    <CheckCircle size={14} /> {p.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No payment history found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Record New Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Select Invoice</label>
                  <select required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" value={formData.invoiceId} onChange={e => {
                    const inv = invoices.find(i => i.id == e.target.value);
                    setFormData({...formData, invoiceId: e.target.value, amount: inv ? inv.total : ''});
                  }}>
                    <option value="">-- Choose Pending Invoice --</option>
                    {invoices.filter(i => i.status !== 'Paid').map(i => (
                      <option key={i.id} value={i.id}>{i.invoiceNumber} - ${i.total}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Amount Received</label>
                  <input type="number" step="0.01" min="0.01" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Payment Date</label>
                  <input type="date" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Payment Method</label>
                  <select className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI / Online">UPI / Online</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 font-medium text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payments;
