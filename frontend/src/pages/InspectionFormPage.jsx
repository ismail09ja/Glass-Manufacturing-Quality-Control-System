import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { ArrowLeft, Save } from 'lucide-react';

const InspectionFormPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batch: searchParams.get('batch') || '',
    result: 'pass',
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: '',
    thickness: '', clarity: '', strength: '',
    width: '', height: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
    if (isEdit) fetchInspection();
  }, [id]);

  const fetchBatches = async () => {
    try {
      const { data } = await API.get('/batches?limit=100');
      setBatches(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInspection = async () => {
    try {
      const { data } = await API.get(`/inspections/${id}`);
      setFormData({
        batch: data.batch?._id || data.batch || '',
        result: data.result,
        inspectionDate: new Date(data.inspectionDate).toISOString().split('T')[0],
        notes: data.notes || '',
        thickness: data.parameters?.thickness?.value || '',
        clarity: data.parameters?.clarity?.score || '',
        strength: data.parameters?.strength?.value || '',
        width: data.parameters?.dimensions?.width || '',
        height: data.parameters?.dimensions?.height || ''
      });
    } catch (err) {
      navigate('/inspections');
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
      const payload = {
        batch: formData.batch,
        result: formData.result,
        inspectionDate: formData.inspectionDate,
        notes: formData.notes,
        parameters: {
          thickness: { value: formData.thickness ? parseFloat(formData.thickness) : undefined, unit: 'mm' },
          clarity: { score: formData.clarity ? parseFloat(formData.clarity) : undefined },
          strength: { value: formData.strength ? parseFloat(formData.strength) : undefined, unit: 'MPa' },
          dimensions: {
            width: formData.width ? parseFloat(formData.width) : undefined,
            height: formData.height ? parseFloat(formData.height) : undefined,
            unit: 'mm'
          }
        }
      };

      if (isEdit) {
        await API.put(`/inspections/${id}`, payload);
      } else {
        await API.post('/inspections', payload);
      }
      navigate('/inspections');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={isEdit ? 'Edit Inspection' : 'New Inspection'} />

      <Link to="/inspections" className="back-link">
        <ArrowLeft size={16} /> Back to Inspections
      </Link>

      <div className="glass-panel animate-in" style={{ maxWidth: 640 }}>
        <div className="panel-header">
          <h2>{isEdit ? 'Edit Inspection' : 'New Inspection'}</h2>
        </div>
        <div className="panel-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="batch">Batch</label>
                <select id="batch" name="batch" className="form-control" value={formData.batch} onChange={handleChange} required>
                  <option value="">Select batch...</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.batchNumber} ({b.glassType})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="result">Result</label>
                <select id="result" name="result" className="form-control" value={formData.result} onChange={handleChange}>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="conditional">Conditional</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inspectionDate">Inspection Date</label>
              <input id="inspectionDate" name="inspectionDate" type="date" className="form-control" value={formData.inspectionDate} onChange={handleChange} />
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', marginTop: '8px' }}>
              Quality Parameters
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="thickness">Thickness (mm)</label>
                <input id="thickness" name="thickness" type="number" step="0.01" className="form-control" placeholder="e.g. 4.5" value={formData.thickness} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="clarity">Clarity Score (0-100)</label>
                <input id="clarity" name="clarity" type="number" min="0" max="100" className="form-control" placeholder="e.g. 95" value={formData.clarity} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="strength">Strength (MPa)</label>
                <input id="strength" name="strength" type="number" step="0.1" className="form-control" placeholder="e.g. 120" value={formData.strength} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Dimensions (mm)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input name="width" type="number" className="form-control" placeholder="Width" value={formData.width} onChange={handleChange} />
                  <input name="height" type="number" className="form-control" placeholder="Height" value={formData.height} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="insp-notes">Notes</label>
              <textarea id="insp-notes" name="notes" className="form-control" rows="3" placeholder="Inspection observations..." value={formData.notes} onChange={handleChange} style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : isEdit ? 'Update Inspection' : 'Submit Inspection'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InspectionFormPage;
