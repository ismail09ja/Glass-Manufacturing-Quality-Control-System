import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { ArrowLeft, Pencil, Trash2, Package, ClipboardCheck, AlertTriangle } from 'lucide-react';

const BatchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('inspections');

  useEffect(() => {
    fetchBatch();
  }, [id]);

  const fetchBatch = async () => {
    try {
      const { data } = await API.get(`/batches/${id}`);
      setBatch(data);
    } catch (err) {
      console.error(err);
      navigate('/batches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this batch permanently?')) return;
    try {
      await API.delete(`/batches/${id}`);
      navigate('/batches');
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
      <>
        <Header title="Batch Details" />
        <div className="loading-container"><div className="spinner"></div></div>
      </>
    );
  }

  if (!batch) return null;

  const inspections = batch.inspections || [];
  const defects = batch.defects || [];

  return (
    <>
      <Header title="Batch Details" />

      <Link to="/batches" className="back-link">
        <ArrowLeft size={16} /> Back to Batches
      </Link>

      {/* Batch Info */}
      <div className="glass-panel animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={20} />
            <h2>Batch {batch.batchNumber}</h2>
            <span className={`badge badge-${batch.status}`}>{batch.status.replace('-', ' ')}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/batches/${id}/edit`)}>
              <Pencil size={14} /> Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
        <div className="panel-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-item-label">Glass Type</div>
              <div className="detail-item-value" style={{ textTransform: 'capitalize' }}>{batch.glassType}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Quantity</div>
              <div className="detail-item-value">{batch.quantity?.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Production Date</div>
              <div className="detail-item-value">{formatDate(batch.productionDate)}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Created</div>
              <div className="detail-item-value">{formatDate(batch.createdAt)}</div>
            </div>
            {batch.notes && (
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <div className="detail-item-label">Notes</div>
                <div className="detail-item-value" style={{ fontWeight: 400, fontSize: '14px' }}>{batch.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'inspections' ? 'active' : ''}`} onClick={() => setTab('inspections')}>
          <ClipboardCheck size={14} style={{ marginRight: 6 }} />
          Inspections ({inspections.length})
        </button>
        <button className={`tab ${tab === 'defects' ? 'active' : ''}`} onClick={() => setTab('defects')}>
          <AlertTriangle size={14} style={{ marginRight: 6 }} />
          Defects ({defects.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-panel animate-in">
        {tab === 'inspections' && (
          inspections.length === 0 ? (
            <div className="empty-state">
              <ClipboardCheck size={40} />
              <h3>No inspections yet</h3>
              <p>Run an inspection on this batch.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/inspections/new?batch=' + id)}>
                New Inspection
              </button>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Thickness</th>
                    <th>Clarity</th>
                    <th>Strength</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((insp) => (
                    <tr key={insp._id} className="clickable-row" onClick={() => navigate(`/inspections/${insp._id}`)}>
                      <td>{formatDate(insp.inspectionDate)}</td>
                      <td><span className={`badge badge-${insp.result}`}>{insp.result}</span></td>
                      <td>{insp.parameters?.thickness?.value ? `${insp.parameters.thickness.value} ${insp.parameters.thickness.unit}` : '—'}</td>
                      <td>{insp.parameters?.clarity?.score != null ? `${insp.parameters.clarity.score}/100` : '—'}</td>
                      <td>{insp.parameters?.strength?.value ? `${insp.parameters.strength.value} ${insp.parameters.strength.unit}` : '—'}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{insp.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'defects' && (
          defects.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle size={40} />
              <h3>No defects recorded</h3>
              <p>No quality defects found for this batch.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/defects/new?batch=' + id)}>
                Report Defect
              </button>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map((def) => (
                    <tr key={def._id} className="clickable-row" onClick={() => navigate(`/defects/${def._id}`)}>
                      <td style={{ textTransform: 'capitalize' }}>{def.defectType}</td>
                      <td><span className={`badge badge-${def.severity}`}>{def.severity}</span></td>
                      <td><span className={`badge badge-${def.status}`}>{def.status.replace('-', ' ')}</span></td>
                      <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{def.description}</td>
                      <td>{formatDate(def.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default BatchDetailPage;
