'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function DefectsPage() {
    const [defects, setDefects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        defectType: 'crack', severity: 'low', description: '', batch: '', correctiveAction: '',
    });

    const fetchDefects = async () => {
        try {
            const { data } = await api.get('/defects');
            setDefects(data.defects || []);
        } catch { } finally { setLoading(false); }
    };

    const fetchBatches = async () => {
        try { const { data } = await api.get('/batches?limit=100'); setBatches(data.batches || []); } catch { }
    };

    useEffect(() => { fetchDefects(); fetchBatches(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/defects', form);
            setShowForm(false);
            setForm({ defectType: 'crack', severity: 'low', description: '', batch: '', correctiveAction: '' });
            fetchDefects();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/defects/${id}`, { resolutionStatus: 'resolved' });
            fetchDefects();
        } catch { }
    };

    const severityColor = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-orange-400', critical: 'text-red-400' };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Defect Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Track and resolve manufacturing defects</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary cursor-pointer">
                    {showForm ? 'Cancel' : '+ Report Defect'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Report Defect</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Batch</label>
                            <select className="glass-input" value={form.batch}
                                onChange={(e) => setForm({ ...form, batch: e.target.value })} required>
                                <option value="">Select batch...</option>
                                {batches.map((b) => <option key={b._id} value={b._id}>{b.batchId}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Defect Type</label>
                            <select className="glass-input" value={form.defectType}
                                onChange={(e) => setForm({ ...form, defectType: e.target.value })}>
                                <option value="crack">Crack</option>
                                <option value="bubble">Bubble</option>
                                <option value="scratch">Scratch</option>
                                <option value="discoloration">Discoloration</option>
                                <option value="thickness_variation">Thickness Variation</option>
                                <option value="contamination">Contamination</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Severity</label>
                            <select className="glass-input" value={form.severity}
                                onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-slate-400 mb-1">Description</label>
                            <input className="glass-input" placeholder="Describe the defect..." value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Corrective Action</label>
                            <input className="glass-input" placeholder="Recommended action" value={form.correctiveAction}
                                onChange={(e) => setForm({ ...form, correctiveAction: e.target.value })} />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn-primary w-full cursor-pointer">Submit</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Type</th>
                                <th>Severity</th>
                                <th>Description</th>
                                <th>Action</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading...</td></tr>
                            ) : defects.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No defects reported</td></tr>
                            ) : defects.map((d) => (
                                <tr key={d._id}>
                                    <td className="font-medium text-primary-400">{d.batch?.batchId || 'N/A'}</td>
                                    <td className="capitalize">{d.defectType.replace('_', ' ')}</td>
                                    <td><span className={`font-semibold capitalize ${severityColor[d.severity]}`}>{d.severity}</span></td>
                                    <td className="max-w-48 truncate">{d.description}</td>
                                    <td className="text-slate-400 max-w-36 truncate">{d.correctiveAction || '—'}</td>
                                    <td>
                                        <span className={`badge ${d.resolutionStatus === 'resolved' ? 'badge-resolved' : 'badge-open'}`}>
                                            {d.resolutionStatus}
                                        </span>
                                    </td>
                                    <td>
                                        {d.resolutionStatus !== 'resolved' && (
                                            <button onClick={() => handleResolve(d._id)} className="btn-success text-xs cursor-pointer">Resolve</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
