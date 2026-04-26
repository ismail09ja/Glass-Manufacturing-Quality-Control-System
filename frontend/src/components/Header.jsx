import { Search, Plus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const Header = ({ title, children }) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flex: 1 }}>
        <h1 className="header-title" style={{ minWidth: 'fit-content' }}>{title}</h1>
        
        <div className="search-input-wrapper" style={{ maxWidth: '400px' }}>
          <Search />
          <input 
            type="text" 
            placeholder="Search batches, inspections..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="btn-icon" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/batches/new')}>
          <Plus size={16} /> New Batch
        </button>
        {children}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--accent-pink);
          border-radius: 50%;
          border: 2px solid var(--bg-tertiary);
        }
      `}} />
    </header>
  );
};

export default Header;
