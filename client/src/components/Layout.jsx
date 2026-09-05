import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, CreditCard, BarChart, LogOut, Package } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getNavItems = () => {
    const role = (user.role || 'administrator').toLowerCase();
    
    const allItems = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['administrator', 'business owner'] },
      { name: 'Invoices', path: '/invoices', icon: FileText, roles: ['administrator', 'business owner', 'accountant', 'customer'] },
      { name: 'Customers', path: '/customers', icon: Users, roles: ['administrator', 'business owner', 'accountant'] },
      { name: 'Products', path: '/products', icon: Package, roles: ['administrator', 'business owner'] },
      { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['administrator', 'business owner', 'accountant', 'customer'] },
      { name: 'Reports', path: '/reports', icon: BarChart, roles: ['administrator', 'business owner', 'accountant'] },
    ];

    return allItems.filter(item => item.roles.includes(role));
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-5 text-2xl font-extrabold border-b border-slate-800 tracking-tight text-blue-400">
          InvoicePro
        </div>
        <div className="p-5 border-b border-slate-800">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Welcome</p>
          <p className="font-semibold text-lg">{user.name || 'User'}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-md border border-blue-800/50 capitalize">
            {user.role || 'Admin'}
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-slate-400 hover:text-white w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 px-8 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {location.pathname.split('/')[1] || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-8 flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
