import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/Components/Navbar/NavbarLayout';

const AdminLayout = () => {
  return (
    <div className="erp-container">
      {/* If you have a Sidebar or Navbar, they go here */}
      {/* <aside>Sidebarnn</aside>  */}
      
      <main>
        {/* THIS IS THE KEY: Without this, children won't show! */}
       <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </main>
    </div>
  );
};

export default AdminLayout;