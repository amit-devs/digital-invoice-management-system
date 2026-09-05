import { useState, useEffect } from 'react';
import api from '../services/api';
import { Printer, Download, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/dashboard'); 
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchReports();
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
        <div className="flex gap-3 no-print">
          <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <Printer size={18} /> Print Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Sales & Revenue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-600" size={24} />
              <p className="font-semibold text-green-900">Total Revenue</p>
            </div>
            <p className="text-3xl font-extrabold text-green-700">${data.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-600" size={24} />
              <p className="font-semibold text-blue-900">Total Invoices</p>
            </div>
            <p className="text-3xl font-extrabold text-blue-700">{data.totalInvoices}</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-emerald-600" size={24} />
              <p className="font-semibold text-emerald-900">Paid Invoices</p>
            </div>
            <p className="text-3xl font-extrabold text-emerald-700">{data.paidInvoices}</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="text-orange-600" size={24} />
              <p className="font-semibold text-orange-900">Pending Invoices</p>
            </div>
            <p className="text-3xl font-extrabold text-orange-700">{data.pendingInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Collection Rate</h3>
          <div className="flex items-center justify-center p-8">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-[16px] border-green-500"
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, // Fake pie chart 
                  opacity: data.totalInvoices > 0 ? (data.paidInvoices / data.totalInvoices) : 0
                }}
              ></div>
              <div className="text-center z-10">
                <p className="text-4xl font-black text-gray-800">
                  {data.totalInvoices > 0 ? Math.round((data.paidInvoices / data.totalInvoices) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">Paid</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 no-print">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Export Data</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Download your financial data as CSV files for importing into external accounting software like QuickBooks or Xero.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-slate-800 text-white px-5 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-700 transition-colors shadow-md shadow-slate-900/20">
              <Download size={20} /> Export Invoices (CSV)
            </button>
            <button className="flex-1 bg-slate-800 text-white px-5 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-700 transition-colors shadow-md shadow-slate-900/20">
              <Download size={20} /> Export Payments (CSV)
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .shadow-sm { box-shadow: none; border-color: #ddd; }
        }
      `}} />
    </div>
  );
};
export default Reports;
