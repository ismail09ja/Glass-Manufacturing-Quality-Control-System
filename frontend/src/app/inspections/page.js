'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function InspectionsPage() {
    const [inspections, setInspections] = useState([]);
    const [batches, setBatches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        batch: '', thickness: '', transparencyLevel: '', surfaceDefects: 'none',
        strengthTestResult: '', inspectionStatus: 'pass', inspectorName: '', inspectionDate: '',
    });

    const fetchInspections = async () => {
        try {
            const { data } = await api.get('/inspection');
            setInspections(data.inspections || []);
        } catch { console.error('Failed to load inspections'); }
        finally { setLoading(false); }
    };

    const fetchBatches = async () => {
        try {
            const { data } = await api.get('/batches?limit=100');
            setBatches(data.batches || []);
        } catch { }
    };

    useEffect(() => { fetchInspections(); fetchBatches(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inspection', {
                ...form,
                thickness: Number(form.thickness),
                transparencyLevel: Number(form.transparencyLevel),
                strengthTestResult: Number(form.strengthTestResult),
            });
            setShowForm(false);
            setForm({ batch: '', thickness: '', transparencyLevel: '', surfaceDefects: 'none', strengthTestResult: '', inspectionStatus: 'pass', inspectorName: '', inspectionDate: '' });
            fetchInspections();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating inspection');
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quality Inspections</h1>
                    <p className="text-slate-400 text-sm mt-1">Record and manage inspection results</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary cursor-pointer">
                    {showForm ? 'Cancel' : '+ New Inspection'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Quality Inspection Form</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Batch</label>
                            <select className="glass-input" value={form.batch}
                                onChange={(e) => setForm({ ...form, batch: e.target.value })} required>
                                <option value="">Select batch...</option>
                                {batches.map((b) => (
                                    <option key={b._id} value={b._id}>{b.batchId} — {b.productionLine}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Thickness (mm)</label>
                            <input className="glass-input" type="number" step="0.01" placeholder="4.5" value={form.thickness}
                                onChange={(e) => setForm({ ...form, thickness: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Transparency (%)</label>
                            <input className="glass-input" type="number" min="0" max="100" placeholder="92" value={form.transparencyLevel}
                                onChange={(e) => setForm({ ...form, transparencyLevel: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Surface Defects</label>
                            <select className="glass-input" value={form.surfaceDefects}
                                onChange={(e) => setForm({ ...form, surfaceDefects: e.target.value })}>
                                <option value="none">None</option>
                                <option value="minor">Minor</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Strength Test (MPa)</label>
                            <input className="glass-input" type="number" step="0.1" placeholder="120" value={form.strengthTestResult}
                                onChange={(e) => setForm({ ...form, strengthTestResult: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Status</label>
                            <select className="glass-input" value={form.inspectionStatus}
                                onChange={(e) => setForm({ ...form, inspectionStatus: e.target.value })}>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Inspector Name</label>
                            <input className="glass-input" placeholder="Inspector name" value={form.inspectorName}
                                onChange={(e) => setForm({ ...form, inspectorName: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Inspection Date</label>
                            <input className="glass-input" type="date" value={form.inspectionDate}
                                onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })} required />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn-primary w-full cursor-pointer">Submit Inspection</button>
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
                                <th>Thickness</th>
                                <th>Transparency</th>
                                <th>Surface</th>
                                <th>Strength</th>
                                <th>Status</th>
                                <th>Inspector</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-500">Loading...</td></tr>
                            ) : inspections.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No inspections yet</td></tr>
                            ) : inspections.map((ins) => (
                                <tr key={ins._id}>
                                    <td className="font-medium text-primary-400">{ins.batch?.batchId || 'N/A'}</td>
                                    <td>{ins.thickness} mm</td>
                                    <td>{ins.transparencyLevel}%</td>
                                    <td className="capitalize">{ins.surfaceDefects}</td>
                                    <td>{ins.strengthTestResult} MPa</td>
                                    <td>
                                        <span className={`badge ${ins.inspectionStatus === 'pass' ? 'badge-pass' : 'badge-fail'}`}>
                                            {ins.inspectionStatus}
                                        </span>
                                    </td>
                                    <td>{ins.inspectorName}</td>
                                    <td className="text-slate-400">{new Date(ins.inspectionDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
