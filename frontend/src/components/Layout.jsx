import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-60 bg-white shadow-md p-5">
        <h1 className="text-xl font-bold mb-6">TaskManager</h1>

        <nav className="flex flex-col gap-3">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-10 text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}