import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const pageTitles = {
  '/admin/dashboard': 'Overview',
  '/admin/products': 'Inventory Management',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen bg-aether-800 overflow-hidden transition-colors duration-500">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar pageTitle={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
