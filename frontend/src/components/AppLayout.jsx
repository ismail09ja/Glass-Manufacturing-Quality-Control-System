import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
