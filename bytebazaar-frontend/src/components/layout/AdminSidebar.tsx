
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <aside className="w-64 bg-indigo-900 text-white min-h-screen">
      <div className="p-4 border-b border-indigo-800">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/admin" 
              className={`block p-2 rounded ${isActive('/admin') && location.pathname === '/admin' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/projects" 
              className={`block p-2 rounded ${isActive('/admin/projects') ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/categories" 
              className={`block p-2 rounded ${isActive('/admin/categories') ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={`block p-2 rounded ${isActive('/admin/users') ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/orders" 
              className={`block p-2 rounded ${isActive('/admin/orders') ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
            >
              Orders
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
