import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { 
  Download, Filter, Calendar, BarChart2, 
  FileText, Package, ClipboardCheck, AlertTriangle
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/analytics/dashboard');
      setStats(data);
    } catch (err) {
      toast.error('Failed to load summary stats');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const { data } = await API.get(`/analytics/export`, { 
        params: { type, ...filters },
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_${type}_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported!`);
    } catch (err) {
      toast.error(`Failed to export ${type} report`);
    } finally {
      setExporting(null);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header title="Reports & Analytics" />
      
      <div className="page-header">
        <div>
          <h1>Production Reports</h1>
          <p className="page-header-sub">Generate and export quality control data</p>
        </div>
        <button className="btn btn-secondary" onClick={handlePrintPDF}>
          <FileText size={18} /> Print to PDF
        </button>
      </div>

      <div className="filters-bar" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar size={18} color="var(--text-secondary)" />
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input 
              type="date" 
              name="from" 
              className="filter-select" 
              value={filters.from} 
              onChange={handleFilterChange} 
            />
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>to</span>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input 
              type="date" 
              name="to" 
              className="filter-select" 
              value={filters.to} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Export Card 1: Batches */}
        <div className="glass-panel animate-in">
          <div className="panel-body" style={{ padding: 30, textAlign: 'center' }}>
            <div className="report-icon cyan">
              <Package size={32} />
            </div>
            <h3 style={{ marginTop: 20 }}>Batch Production</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '15px 0 25px' }}>
              Full report of all production batches, status, and quantities.
            </p>
            <button 
              className="btn btn-primary btn-block" 
              disabled={exporting === 'batches'}
              onClick={() => handleExport('batches')}
            >
              {exporting === 'batches' ? 'Generating...' : <><Download size={18} /> Export CSV</>}
            </button>
          </div>
        </div>

        {/* Export Card 2: Inspections */}
        <div className="glass-panel animate-in">
          <div className="panel-body" style={{ padding: 30, textAlign: 'center' }}>
            <div className="report-icon violet">
              <ClipboardCheck size={32} />
            </div>
            <h3 style={{ marginTop: 20 }}>Inspections</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '15px 0 25px' }}>
              Historical inspection results, scores, and inspector details.
            </p>
            <button 
              className="btn btn-primary btn-block"
              disabled={exporting === 'inspections'}
              onClick={() => handleExport('inspections')}
            >
              {exporting === 'inspections' ? 'Generating...' : <><Download size={18} /> Export CSV</>}
            </button>
          </div>
        </div>

        {/* Export Card 3: Defects */}
        <div className="glass-panel animate-in">
          <div className="panel-body" style={{ padding: 30, textAlign: 'center' }}>
            <div className="report-icon red">
              <AlertTriangle size={32} />
            </div>
            <h3 style={{ marginTop: 20 }}>Quality Defects</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '15px 0 25px' }}>
              Detailed defect tracking log, including severity and status.
            </p>
            <button 
              className="btn btn-primary btn-block"
              disabled={exporting === 'defects'}
              onClick={() => handleExport('defects')}
            >
              {exporting === 'defects' ? 'Generating...' : <><Download size={18} /> Export CSV</>}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel animate-in" style={{ marginTop: 24 }}>
        <div className="panel-header">
          <h3>Summary Statistics</h3>
        </div>
        <div className="panel-body">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner"></div></div>
          ) : (
            <div className="stats-list">
              <div className="summary-item">
                <span className="summary-label">Total Volume Reported</span>
                <span className="summary-value cyan-text">{stats?.kpis?.totalBatches || 0} Batches</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Quality Pass Rate</span>
                <span className="summary-value green-text">{stats?.kpis?.passRate || 0}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Average Defects/Batch</span>
                <span className="summary-value red-text">
                  {(stats?.kpis?.totalDefects / (stats?.kpis?.totalBatches || 1)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .report-icon {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .report-icon.cyan { background: rgba(34,211,238,0.1); color: var(--accent-cyan); }
        .report-icon.violet { background: rgba(139,92,246,0.1); color: var(--accent-violet); }
        .report-icon.red { background: rgba(248,113,113,0.1); color: var(--color-danger); }
        
        .stats-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .summary-item {
          padding: 20px;
          background: var(--bg-glass);
          border-radius: 12px;
          border: 1px solid var(--border-primary);
        }
        .summary-label {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        .summary-value {
          font-size: 20px;
          font-weight: 700;
        }
        .cyan-text { color: var(--accent-cyan); }
        .green-text { color: var(--color-success); }
        .red-text { color: var(--color-danger); }

        @media print {
          .sidebar, .header, .filters-bar, .btn, .btn-icon, .legend-panel {
            display: none !important;
          }
          .app-main {
            margin-left: 0 !important;
          }
          .app-content {
            padding: 0 !important;
          }
          .glass-panel {
            background: white !important;
            color: black !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .panel-header {
            border-bottom: 1px solid #ddd !important;
          }
          .summary-item {
            background: #f9f9f9 !important;
            border: 1px solid #eee !important;
            color: black !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          h1, h2, h3 {
            color: black !important;
          }
          .cyan-text, .green-text, .red-text {
            color: black !important;
            font-weight: bold;
          }
          .page-header h1::after {
            content: " - Quality Control Report";
          }
        }
      `}} />
    </>
  );
};

export default ReportsPage;
