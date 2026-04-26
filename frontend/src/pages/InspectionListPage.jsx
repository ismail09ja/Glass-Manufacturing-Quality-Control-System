import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { useSearch } from '../context/SearchContext';
import { Plus, Search, ClipboardCheck, Eye, Pencil, Trash2 } from 'lucide-react';

const InspectionListPage = () => {
  const [inspections, setInspections] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [resultFilter, setResultFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchInspections();
  }, [page, resultFilter, searchQuery]);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchQuery) params.search = searchQuery;
      if (resultFilter) params.result = resultFilter;
      const { data } = await API.get('/inspections', { params });
      setInspections(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inspection?')) return;
    try {
      await API.delete(`/inspections/${id}`);
      fetchInspections();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <>
      <Header title="Inspections" />

      <div className="page-header">
        <div>
          <h1>Quality Inspections</h1>
          <p className="page-header-sub">Track and manage quality inspection records</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/inspections/new')}>
          <Plus size={16} /> New Inspection
        </button>
      </div>

      <div className="filters-bar">
        <select className="filter-select" value={resultFilter} onChange={(e) => { setResultFilter(e.target.value); setPage(1); }}>
          <option value="">All Results</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
          <option value="conditional">Conditional</option>
        </select>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : inspections.length === 0 ? (
          <div className="empty-state">
            <ClipboardCheck size={48} />
            <h3>No inspections found</h3>
            <p>Create your first quality inspection record.</p>
            <button className="btn btn-primary" onClick={() => navigate('/inspections/new')}>
              <Plus size={16} /> New Inspection
            </button>
          </div>
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Inspector</th>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Thickness</th>
                    <th>Clarity</th>
                    <th>Strength</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((insp) => (
                    <tr key={insp._id}>
                      <td style={{ fontWeight: 600 }}>{insp.batch?.batchNumber || 'N/A'}</td>
                      <td>{insp.inspector?.name || 'N/A'}</td>
                      <td>{formatDate(insp.inspectionDate)}</td>
                      <td><span className={`badge badge-${insp.result}`}>{insp.result}</span></td>
                      <td>{insp.parameters?.thickness?.value ? `${insp.parameters.thickness.value} mm` : '—'}</td>
                      <td>{insp.parameters?.clarity?.score != null ? `${insp.parameters.clarity.score}%` : '—'}</td>
                      <td>{insp.parameters?.strength?.value ? `${insp.parameters.strength.value} MPa` : '—'}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Edit" onClick={() => navigate(`/inspections/${insp._id}/edit`)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn-icon" title="Delete" onClick={() => handleDelete(insp._id)}>
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

export default InspectionListPage;
