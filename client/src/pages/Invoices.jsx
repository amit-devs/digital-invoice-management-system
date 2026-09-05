import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2, Download, Printer } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdf';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const generateInvoiceNumber = () => `INV-${Date.now().toString().slice(-6)}`;
  
  const initialForm = { 
    invoiceNumber: '', 
    customerId: '', 
    date: new Date().toISOString().split('T')[0], 
    dueDate: '', 
    items: [{ description: '', quantity: 1, unitPrice: 0 }], 
    tax: 0, 
    discount: 0, 
    status: 'Pending' 
  };
  
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      const [invRes, custRes, prodRes] = await Promise.all([
        api.get('/invoices'), 
        api.get('/customers'),
        api.get('/products').catch(() => ({ data: [] }))
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/invoices/${editingId}`, formData);
      else await api.post('/invoices', formData);
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Error saving invoice'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      await api.delete(`/invoices/${id}`);
      fetchData();
    }
  };

  const openEdit = (invoice) => {
    setFormData(invoice);
    setEditingId(invoice.id);
    setIsModalOpen(true);
  };
  
  const handlePrint = (invoice) => {
    const cust = customers.find(c => c.id == invoice.customerId);
    generateInvoicePDF(invoice, cust);
  };

  const filtered = invoices.filter(i => {
    const matchesSearch = i.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getCustomerName = (id) => customers.find(c => c.id == id)?.name || 'Unknown';
  
  // Calculate totals on the fly for the form
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * ((formData.tax || 0) / 100);
  const total = subtotal + taxAmount - (formData.discount || 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
        <button onClick={() => { setFormData({...initialForm, invoiceNumber: generateInvoiceNumber()}); setEditingId(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 w-full md:w-auto justify-center">
          <Plus size={20} /> Create Invoice
        </button>
      </div>

      <div className="overflow-x-auto">
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
                <td className="py-3 font-medium text-blue-600">{i.invoiceNumber}</td>
                <td className="py-3 text-gray-800">{getCustomerName(i.customerId)}</td>
                <td className="py-3 text-gray-600">{i.date}</td>
                <td className="py-3 font-bold">${i.total.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${i.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{i.status}</span>
                </td>
                <td className="py-3">
                  <div className="flex gap-3">
                    <button onClick={() => handlePrint(i)} className="text-gray-500 hover:text-gray-700" title="Download PDF"><Download size={18} /></button>
                    <button onClick={() => openEdit(i)} className="text-blue-500 hover:text-blue-700" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(i.id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="py-8 text-center text-gray-500">No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto py-10 z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl my-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Invoice' : 'Create New Invoice'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Invoice #</label>
                  <input required className="w-full p-2 border rounded-lg bg-gray-50" value={formData.invoiceNumber} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Customer</label>
                  <select required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Due Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-semibold mb-3 text-gray-700">Invoice Items</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 mb-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs text-gray-500 mb-1">Product/Service</label>
                      <input 
                        list="productsList"
                        placeholder="Description" 
                        required 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        value={item.description} 
                        onChange={e => { 
                          const newItems = [...formData.items]; 
                          newItems[index].description = e.target.value; 
                          // auto fill price if match
                          const match = products.find(p => p.name === e.target.value);
                          if(match) {
                            newItems[index].unitPrice = match.price;
                            if(index === 0 && formData.tax === 0) setFormData(f => ({...f, tax: match.tax})); // Apply product tax globally if simple
                          }
                          setFormData({...formData, items: newItems}); 
                        }} 
                      />
                      <datalist id="productsList">
                        {products.map(p => <option key={p.id} value={p.name} />)}
                      </datalist>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Qty</label>
                      <input type="number" min="1" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={item.quantity} onChange={e => { const newItems = [...formData.items]; newItems[index].quantity = Number(e.target.value); setFormData({...formData, items: newItems}); }} />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 mb-1">Price</label>
                      <input type="number" step="0.01" min="0" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={item.unitPrice} onChange={e => { const newItems = [...formData.items]; newItems[index].unitPrice = Number(e.target.value); setFormData({...formData, items: newItems}); }} />
                    </div>
                    <div className="w-32 pb-2 font-semibold text-gray-700">
                      ${ (item.quantity * item.unitPrice).toFixed(2) }
                    </div>
                    <div className="pb-2">
                      {formData.items.length > 1 && <button type="button" onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={18}/></button>}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, {description:'', quantity:1, unitPrice:0}]})} className="text-blue-600 font-medium text-sm mt-2 hover:underline">+ Add Item</button>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Tax (%)</label>
                    <input type="number" min="0" step="0.1" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.tax} onChange={e => setFormData({...formData, tax: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Discount ($)</label>
                    <input type="number" min="0" step="0.01" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                    <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-end">
                  <div className="flex justify-between mb-2 text-sm text-gray-600"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600"><span>Tax ({formData.tax || 0}%):</span> <span>${taxAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600"><span>Discount:</span> <span className="text-red-500">-${Number(formData.discount || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between mt-2 pt-2 border-t font-bold text-lg text-gray-800"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Invoices;
