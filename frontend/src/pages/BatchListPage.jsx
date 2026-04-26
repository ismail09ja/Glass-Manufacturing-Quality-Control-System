import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { useSearch } from '../context/SearchContext';
import { Plus, Search, Package, Eye, Pencil, Trash2 } from 'lucide-react';

const BatchListPage = () => {
  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchBatches();
  }, [page, statusFilter, typeFilter, searchQuery]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.glassType = typeFilter;
      const { data } = await API.get('/batches', { params });
      setBatches(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBatches();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      await API.delete(`/batches/${id}`);
      fetchBatches();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <>
      <Header title="Batches" />

      <div className="page-header">
        <div>
          <h1>Production Batches</h1>
          <p className="page-header-sub">Manage and track glass production batches</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/batches/new')}>
          <Plus size={16} /> New Batch
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="in-production">In Production</option>
          <option value="inspection">Inspection</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Glass Types</option>
          <option value="tempered">Tempered</option>
          <option value="laminated">Laminated</option>
          <option value="float">Float</option>
          <option value="coated">Coated</option>
          <option value="insulated">Insulated</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : batches.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No batches found</h3>
            <p>Create your first production batch to get started.</p>
            <button className="btn btn-primary" onClick={() => navigate('/batches/new')}>
              <Plus size={16} /> Create Batch
            </button>
          </div>
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch #</th>
                    <th>Glass Type</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Production Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch._id} className="clickable-row" onClick={() => navigate(`/batches/${batch._id}`)}>
                      <td style={{ fontWeight: 600 }}>{batch.batchNumber}</td>
                      <td style={{ textTransform: 'capitalize' }}>{batch.glassType}</td>
                      <td>{batch.quantity?.toLocaleString()}</td>
                      <td><span className={`badge badge-${batch.status}`}>{batch.status.replace('-', ' ')}</span></td>
                      <td>{formatDate(batch.productionDate)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="table-actions">
                          <button className="btn-icon" title="View" onClick={() => navigate(`/batches/${batch._id}`)}>
                            <Eye size={14} />
                          </button>
                          <button className="btn-icon" title="Edit" onClick={() => navigate(`/batches/${batch._id}/edit`)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn-icon" title="Delete" onClick={() => handleDelete(batch._id)}>
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

export default BatchListPage;
