import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofill = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Left side styling / Branding */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="z-10 text-center max-w-md">
          <ShieldCheck size={80} className="mx-auto mb-8 text-blue-300" />
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">InvoicePro</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Manage your customers, create professional invoices, and track payments securely in one place.
          </p>
        </div>
      </div>

      {/* Right side login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-xl border border-red-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
                placeholder="you@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-4 text-center md:text-left">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => autofill('admin@example.com', 'password')} className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                <strong>Admin</strong><br/><span className="text-slate-400">Full Access</span>
              </button>
              <button onClick={() => autofill('owner@example.com', 'password')} className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                <strong>Owner</strong><br/><span className="text-slate-400">Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
