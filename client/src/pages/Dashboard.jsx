import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
            <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="text-green-500" size={24} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-800">${data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Invoices</h3>
            <div className="p-2 bg-blue-50 rounded-lg"><FileText className="text-blue-500" size={24} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{data.totalInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Paid Invoices</h3>
            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle className="text-emerald-500" size={24} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{data.paidInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Pending Payments</h3>
            <div className="p-2 bg-orange-50 rounded-lg"><Clock className="text-orange-500" size={24} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{data.pendingInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Customers</h3>
            <div className="p-2 bg-purple-50 rounded-lg"><Users className="text-purple-500" size={24} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{data.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-2">Invoice #</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{inv.invoiceNumber}</td>
                    <td className="py-3 text-gray-600">{inv.date}</td>
                    <td className="py-3 font-medium">${inv.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentInvoices.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No recent invoices.</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((pay) => (
                  <tr key={pay.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-600">{pay.date}</td>
                    <td className="py-3 font-medium">${pay.amount.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{pay.method}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        pay.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentPayments.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No recent payments.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
