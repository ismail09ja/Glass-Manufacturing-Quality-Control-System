import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import { ArrowLeft, Save } from 'lucide-react';

const BatchFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    batchNumber: '',
    glassType: 'float',
    quantity: '',
    status: 'in-production',
    productionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchBatch();
    }
  }, [id]);

  const fetchBatch = async () => {
    try {
      const { data } = await API.get(`/batches/${id}`);
      setFormData({
        batchNumber: data.batchNumber,
        glassType: data.glassType,
        quantity: data.quantity,
        status: data.status,
        productionDate: new Date(data.productionDate).toISOString().split('T')[0],
        notes: data.notes || ''
      });
    } catch (err) {
      navigate('/batches');
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
      const payload = { ...formData, quantity: parseInt(formData.quantity) };
      if (isEdit) {
        await API.put(`/batches/${id}`, payload);
      } else {
        await API.post('/batches', payload);
      }
      navigate('/batches');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={isEdit ? 'Edit Batch' : 'New Batch'} />

      <Link to="/batches" className="back-link">
        <ArrowLeft size={16} /> Back to Batches
      </Link>

      <div className="glass-panel animate-in" style={{ maxWidth: 640 }}>
        <div className="panel-header">
          <h2>{isEdit ? 'Edit Batch' : 'Create New Batch'}</h2>
        </div>
        <div className="panel-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="batchNumber">Batch Number</label>
                <input
                  id="batchNumber"
                  name="batchNumber"
                  className="form-control"
                  placeholder="e.g. BATCH-001"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="glassType">Glass Type</label>
                <select id="glassType" name="glassType" className="form-control" value={formData.glassType} onChange={handleChange}>
                  <option value="tempered">Tempered</option>
                  <option value="laminated">Laminated</option>
                  <option value="float">Float</option>
                  <option value="coated">Coated</option>
                  <option value="insulated">Insulated</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Number of units"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange}>
                  <option value="in-production">In Production</option>
                  <option value="inspection">Inspection</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productionDate">Production Date</label>
              <input
                id="productionDate"
                name="productionDate"
                type="date"
                className="form-control"
                value={formData.productionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="3"
                placeholder="Optional notes about this batch..."
                value={formData.notes}
                onChange={handleChange}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : isEdit ? 'Update Batch' : 'Create Batch'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BatchFormPage;
