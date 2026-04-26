import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { useSearch } from '../context/SearchContext';
import { Plus, AlertTriangle, Pencil, Trash2 } from 'lucide-react';

const DefectListPage = () => {
  const [defects, setDefects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchDefects();
  }, [page, severityFilter, statusFilter, typeFilter, searchQuery]);

  const fetchDefects = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchQuery) params.search = searchQuery;
      if (severityFilter) params.severity = severityFilter;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.defectType = typeFilter;
      const { data } = await API.get('/defects', { params });
      setDefects(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this defect record?')) return;
    try {
      await API.delete(`/defects/${id}`);
      fetchDefects();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <>
      <Header title="Defects" />

      <div className="page-header">
        <div>
          <h1>Defect Tracker</h1>
          <p className="page-header-sub">Monitor and manage quality defects</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/defects/new')}>
          <Plus size={16} /> Report Defect
        </button>
      </div>

      <div className="filters-bar">
        <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="crack">Crack</option>
          <option value="bubble">Bubble</option>
          <option value="scratch">Scratch</option>
          <option value="discoloration">Discoloration</option>
          <option value="dimensional">Dimensional</option>
          <option value="other">Other</option>
        </select>
        <select className="filter-select" value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}>
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="under-review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : defects.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} />
            <h3>No defects found</h3>
            <p>No quality defects have been reported yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/defects/new')}>
              <Plus size={16} /> Report Defect
            </button>
          </div>
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Reported By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map((def) => (
                    <tr key={def._id}>
                      <td style={{ fontWeight: 600 }}>{def.batch?.batchNumber || 'N/A'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{def.defectType}</td>
                      <td><span className={`badge badge-${def.severity}`}>{def.severity}</span></td>
                      <td><span className={`badge badge-${def.status}`}>{def.status.replace('-', ' ')}</span></td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {def.description}
                      </td>
                      <td>{def.reportedBy?.name || 'N/A'}</td>
                      <td>{formatDate(def.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Edit" onClick={() => navigate(`/defects/${def._id}/edit`)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn-icon" title="Delete" onClick={() => handleDelete(def._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DefectListPage;
