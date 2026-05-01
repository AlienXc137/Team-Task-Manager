import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, LayoutDashboard, LogOut, FolderKanban } from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden font-sans text-white">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 h-full hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-white/20">
            <CheckCircle size={24} /> TaskManager
          </div>
          <nav className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${location.pathname === '/dashboard' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              to="/projects"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${location.pathname.includes('/projects') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                }`}
            >
              <FolderKanban size={18} /> Projects
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-300 hover:bg-white/10 rounded-lg transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/20 p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-bold text-lg">
          <CheckCircle size={20} /> TaskManager
        </div>
        <button onClick={logout} className="text-sm text-red-300 font-medium">Logout</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-14 md:mt-0 relative w-full h-full p-6">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 flex z-20 pb-safe">
        <Link to="/dashboard" className={`flex-1 py-4 flex justify-center ${location.pathname === '/dashboard' ? 'text-white bg-white/20' : 'text-white/60'}`}>
          <LayoutDashboard size={20} />
        </Link>
        <Link to="/projects" className={`flex-1 py-4 flex justify-center ${location.pathname.includes('/projects') ? 'text-white bg-white/20' : 'text-white/60'}`}>
          <FolderKanban size={20} />
        </Link>
      </div>
    </div>
  );
}