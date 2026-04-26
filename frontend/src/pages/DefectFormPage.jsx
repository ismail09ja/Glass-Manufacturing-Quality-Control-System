import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { ArrowLeft, Save } from 'lucide-react';

const DefectFormPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batch: searchParams.get('batch') || '',
    defectType: 'crack',
    severity: 'minor',
    status: 'open',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
    if (isEdit) fetchDefect();
  }, [id]);

  const fetchBatches = async () => {
    try {
      const { data } = await API.get('/batches?limit=100');
      setBatches(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDefect = async () => {
    try {
      const { data } = await API.get(`/defects/${id}`);
      setFormData({
        batch: data.batch?._id || data.batch || '',
        defectType: data.defectType,
        severity: data.severity,
        status: data.status,
        description: data.description
      });
    } catch (err) {
      navigate('/defects');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/defects/${id}`, formData);
      } else {
        await API.post('/defects', formData);
      }
      navigate('/defects');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={isEdit ? 'Edit Defect' : 'Report Defect'} />

      <Link to="/defects" className="back-link">
        <ArrowLeft size={16} /> Back to Defects
      </Link>

      <div className="glass-panel animate-in" style={{ maxWidth: 640 }}>
        <div className="panel-header">
          <h2>{isEdit ? 'Edit Defect' : 'Report New Defect'}</h2>
        </div>
        <div className="panel-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="def-batch">Batch</label>
              <select id="def-batch" name="batch" className="form-control" value={formData.batch} onChange={handleChange} required>
                <option value="">Select batch...</option>
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchNumber} ({b.glassType})</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="defectType">Defect Type</label>
                <select id="defectType" name="defectType" className="form-control" value={formData.defectType} onChange={handleChange}>
                  <option value="crack">Crack</option>
                  <option value="bubble">Bubble</option>
                  <option value="scratch">Scratch</option>
                  <option value="discoloration">Discoloration</option>
                  <option value="dimensional">Dimensional</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="severity">Severity</label>
                <select id="severity" name="severity" className="form-control" value={formData.severity} onChange={handleChange}>
                  <option value="critical">Critical</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
            </div>

            {isEdit && (
              <div className="form-group">
                <label htmlFor="def-status">Status</label>
                <select id="def-status" name="status" className="form-control" value={formData.status} onChange={handleChange}>
                  <option value="open">Open</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                placeholder="Describe the defect in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : isEdit ? 'Update Defect' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DefectFormPage;
