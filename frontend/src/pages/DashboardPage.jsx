import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Header from '../components/Header';
import {
  Package, ClipboardCheck, AlertTriangle, TrendingUp,
  CheckCircle, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#22d3ee', '#8b5cf6', '#34d399', '#f87171', '#fbbf24', '#ec4899'];

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, trendRes] = await Promise.all([
        API.get('/analytics/dashboard'),
        API.get('/analytics/defect-trends?days=30')
      ]);
      setData(dashRes.data);
      setTrends(trendRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="loading-container"><div className="spinner"></div></div>
      </>
    );
  }

  const kpis = data?.kpis || {};
  const batchStatusData = (data?.distributions?.batchStatus || []).map(d => ({
    name: d._id?.replace('-', ' ') || 'Unknown',
    value: d.count
  }));
  const inspectionData = (data?.distributions?.inspectionResults || []).map(d => ({
    name: d._id || 'Unknown',
    value: d.count
  }));
  const defectTypeData = (data?.distributions?.defectType || []).map(d => ({
    name: d._id || 'Unknown',
    value: d.count
  }));

  const productionData = (trends?.productionTrends || []).map(d => ({
    date: d._id,
    batches: d.count,
    quantity: d.totalQuantity
  }));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <Header title="Dashboard" />

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-in" onClick={() => navigate('/batches')} style={{cursor:'pointer'}}>
          <div className="stat-card-header">
            <span className="stat-card-label">Total Batches</span>
            <div className="stat-card-icon cyan"><Package size={20} /></div>
          </div>
          <div className="stat-card-value">{kpis.totalBatches || 0}</div>
          <div className="stat-card-sub">All production batches</div>
        </div>

        <div className="stat-card animate-in">
          <div className="stat-card-header">
            <span className="stat-card-label">Pass Rate</span>
            <div className="stat-card-icon green"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-card-value">{kpis.passRate || 0}%</div>
          <div className="stat-card-sub">Inspection success rate</div>
        </div>

        <div className="stat-card animate-in" onClick={() => navigate('/defects')} style={{cursor:'pointer'}}>
          <div className="stat-card-header">
            <span className="stat-card-label">Open Defects</span>
            <div className="stat-card-icon pink"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-card-value">{kpis.openDefects || 0}</div>
          <div className="stat-card-sub">Requires attention</div>
        </div>

        <div className="stat-card animate-in" onClick={() => navigate('/inspections')} style={{cursor:'pointer'}}>
          <div className="stat-card-header">
            <span className="stat-card-label">Today's Inspections</span>
            <div className="stat-card-icon violet"><ClipboardCheck size={20} /></div>
          </div>
          <div className="stat-card-value">{kpis.inspectionsToday || 0}</div>
          <div className="stat-card-sub">Inspections performed today</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Batch Status Distribution */}
        <div className="glass-panel animate-in">
          <div className="panel-header">
            <h3>Batch Status Distribution</h3>
          </div>
          <div className="panel-body chart-container">
            {batchStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={batchStatusData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {batchStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#12121e', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#f0f0f5', fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No batch data yet</p></div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', paddingBottom: '8px' }}>
              {batchStatusData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a8aa3' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defect Type Distribution */}
        <div className="glass-panel animate-in">
          <div className="panel-header">
            <h3>Defect Types</h3>
          </div>
          <div className="panel-body chart-container">
            {defectTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={defectTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#8a8aa3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8a8aa3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#12121e', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#f0f0f5', fontSize: '13px'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No defect data yet</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Production Trends + Recent Activity */}
      <div className="charts-grid">
        {/* Production Trends */}
        <div className="glass-panel animate-in">
          <div className="panel-header">
            <h3>Production Trends (30 days)</h3>
          </div>
          <div className="panel-body chart-container">
            {productionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#8a8aa3', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8a8aa3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#12121e', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#f0f0f5', fontSize: '13px'
                    }}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="quantity" stroke="#22d3ee" fill="url(#areaGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No production data yet</p></div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel animate-in">
          <div className="panel-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="panel-body" style={{ maxHeight: 310, overflowY: 'auto' }}>
            <ul className="activity-list">
              {(data?.recentActivity?.batches || []).map((b) => (
                <li key={`b-${b._id}`} className="activity-item">
                  <div className="activity-dot cyan"></div>
                  <div className="activity-content">
                    <div className="activity-text">
                      Batch <strong>{b.batchNumber}</strong> — {b.status}
                    </div>
                    <div className="activity-time">{formatDate(b.createdAt)}</div>
                  </div>
                </li>
              ))}
              {(data?.recentActivity?.inspections || []).map((i) => (
                <li key={`i-${i._id}`} className="activity-item">
                  <div className={`activity-dot ${i.result === 'pass' ? 'green' : i.result === 'fail' ? 'red' : 'yellow'}`}></div>
                  <div className="activity-content">
                    <div className="activity-text">
                      Inspection for <strong>{i.batch?.batchNumber || 'N/A'}</strong> — {i.result}
                    </div>
                    <div className="activity-time">{formatDate(i.createdAt)}</div>
                  </div>
                </li>
              ))}
              {(data?.recentActivity?.defects || []).map((d) => (
                <li key={`d-${d._id}`} className="activity-item">
                  <div className="activity-dot red"></div>
                  <div className="activity-content">
                    <div className="activity-text">
                      {d.severity} {d.defectType} on <strong>{d.batch?.batchNumber || 'N/A'}</strong>
                    </div>
                    <div className="activity-time">{formatDate(d.createdAt)}</div>
                  </div>
                </li>
              ))}
              {!data?.recentActivity?.batches?.length && !data?.recentActivity?.inspections?.length && !data?.recentActivity?.defects?.length && (
                <div className="empty-state">
                  <Clock size={32} />
                  <p>No recent activity</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
