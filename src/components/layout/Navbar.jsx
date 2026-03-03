import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode, setSidebarOpen, logout } from '../../slices/uiSlice';
import SearchInput from '../ui/SearchInput';

const defaultBranches = ['Branch One', 'Branch Two', 'Branch Three'];

const fallbackUser = {
  initials: 'AS',
  name: 'AS Admin',
  fullName: 'Admin User',
  email: 'admin@barbaariye.com',
};

export default function Navbar({
  branches = defaultBranches,
  user: userProp,
  onSearch,
  searchPlaceholder = 'Search...',
  notificationCount,
  showSearch = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userFromStore = useSelector((state) => state.ui.user);
  const user = userProp ?? userFromStore ?? fallbackUser;
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [branchOpen, setBranchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const branchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (branchRef.current && !branchRef.current.contains(e.target)) setBranchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchQuery(v);
    onSearch?.(v);
  };

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-between gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 dark:border-slate-700/80 w-full">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0f3d5e]/40 to-transparent pointer-events-none" aria-hidden />
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 overflow-hidden">
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          className="lg:hidden flex-shrink-0 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-shrink-0" ref={branchRef}>
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] sm:max-w-[160px] truncate"
          >
            <span className="truncate">{selectedBranch}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform ${
                branchOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {branchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 py-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-200/90 dark:border-slate-600/80 z-50"
              >
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {branch}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showSearch && (
          <div className="hidden md:block flex-1 min-w-0 max-w-xs lg:max-w-md">
            <SearchInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="!max-w-none"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors duration-200">
          <Bell className="w-5 h-5" />
          {notificationCount != null && notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-teal-900/20">
              {user.initials || 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200">
              {user.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 py-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-200/90 dark:border-slate-600/80 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {user.fullName || user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    navigate('/login', { replace: true });
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
