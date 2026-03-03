import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import { setUser } from '../slices/uiSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = (username || '').trim();
    const pass = (password || '').trim();
    if (!user) {
      setError('Fadlan geli username-ka');
      return;
    }
    if (!pass) {
      setError('Fadlan geli password-ka');
      return;
    }
    const initials = user.slice(0, 2).toUpperCase();
    dispatch(
      setUser({
        name: user,
        fullName: user,
        email: `${user}@barbaariye.com`,
        initials,
      })
    );
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f3d5e] p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-white min-h-[520px]"
      >
        {/* Left panel – Welcome + spheres */}
        <div className="relative lg:w-[45%] bg-gradient-to-br from-[#0f3d5e] via-[#0a2f4a] to-[#062535] text-white p-8 lg:p-10 flex flex-col items-center justify-center text-center min-h-[280px] lg:min-h-0">
          {/* Decorative spheres */}
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-white/10 -translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-[0.2em] uppercase text-white/95">
              Welcome
            </h2>
            <h3 className="text-lg lg:text-xl font-bold tracking-widest uppercase text-white/90">
              Barbaariye
            </h3>
            <p className="text-sm text-white/80 max-w-xs leading-relaxed">
              Maanta ku soo dhawoow maamulka Barbaariye. Geli xogtaada si aad ugu gasho bogga.
            </p>
          </div>
        </div>

        {/* Right panel – Sign in form */}
        <div className="flex-1 bg-white p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sign in</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Geli username-ka iyo password-ka si aad ugu gasho
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="User Name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-[#0f3d5e]/20 focus:border-[#0f3d5e] outline-none transition"
                  autoComplete="username"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-20 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-[#0f3d5e]/20 focus:border-[#0f3d5e] outline-none transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0f3d5e] hover:underline"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0f3d5e] focus:ring-[#0f3d5e]"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-[#0f3d5e] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0f3d5e] hover:bg-[#0a2a3d] text-white font-semibold transition-colors shadow-lg shadow-[#0f3d5e]/25"
              >
                Sign in
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-slate-900 px-3 text-sm text-slate-500 dark:text-slate-400">
                  Or
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Sign in with other
            </button>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <button type="button" className="font-semibold text-[#0f3d5e] hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
