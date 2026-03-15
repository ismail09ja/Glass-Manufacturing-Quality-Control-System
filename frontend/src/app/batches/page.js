'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function BatchesPage() {
    const [batches, setBatches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        batchId: '', furnaceTemperature: '', rawMaterialComposition: '',
        productionDate: '', productionLine: '', shift: 'morning', operatorName: '',
    });

    const fetchBatches = async () => {
        try {
            const { data } = await api.get('/batches');
            setBatches(data.batches || []);
        } catch { console.error('Failed to load batches'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchBatches();
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/batches', { ...form, furnaceTemperature: Number(form.furnaceTemperature) });
            setShowForm(false);
            setForm({ batchId: '', furnaceTemperature: '', rawMaterialComposition: '', productionDate: '', productionLine: '', shift: 'morning', operatorName: '' });
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating batch');
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Batch Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Track production batches</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary cursor-pointer">
                    {showForm ? 'Cancel' : '+ New Batch'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Create New Batch</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Batch ID</label>
                            <input className="glass-input" placeholder="BATCH-001" value={form.batchId}
                                onChange={(e) => setForm({ ...form, batchId: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Furnace Temp (°C)</label>
                            <input className="glass-input" type="number" placeholder="1500" value={form.furnaceTemperature}
                                onChange={(e) => setForm({ ...form, furnaceTemperature: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Raw Material Composition</label>
                            <input className="glass-input" placeholder="SiO2 72%, Na2O 14%..." value={form.rawMaterialComposition}
                                onChange={(e) => setForm({ ...form, rawMaterialComposition: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Production Date</label>
                            <input className="glass-input" type="date" value={form.productionDate}
                                onChange={(e) => setForm({ ...form, productionDate: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Production Line</label>
                            <input className="glass-input" placeholder="Line A" value={form.productionLine}
                                onChange={(e) => setForm({ ...form, productionLine: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Shift</label>
                            <select className="glass-input" value={form.shift}
                                onChange={(e) => setForm({ ...form, shift: e.target.value })}>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="night">Night</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Operator Name</label>
                            <input className="glass-input" placeholder="Operator name" value={form.operatorName}
                                onChange={(e) => setForm({ ...form, operatorName: e.target.value })} required />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn-primary w-full cursor-pointer">Create Batch</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="glass-card shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th className="pl-8">Batch ID</th>
                                <th>Furnace Temp</th>
                                <th>Production Line</th>
                                <th>Shift/Operator</th>
                                <th>Date</th>
                                <th className="pr-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-20 text-slate-500 font-medium italic">Loading manufacturing data...</td></tr>
                            ) : batches.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-20 text-slate-500 font-medium">No production batches found. Begin by creating a new entry.</td></tr>
                            ) : batches.map((b) => (
                                <tr key={b._id} className="group hover:bg-white/[0.02]">
                                    <td className="pl-8">
                                        <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md border border-blue-500/20 inline-block font-bold tracking-tight">
                                            {b.batchId}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-200 font-semibold">{b.furnaceTemperature}°C</span>
                                            {b.furnaceTemperature > 1550 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="High Temperature"></span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-2 py-1 bg-slate-800/50 rounded-md text-xs font-bold border border-white/5 text-slate-300 capitalize">{b.productionLine}</span>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{b.shift}</span>
                                            <span className="text-slate-300 text-sm font-medium">{b.operatorName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-slate-400 text-xs font-medium">
                                            {new Date(b.productionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="pr-8 text-right">
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm(`Are you sure you want to delete Batch ${b.batchId}?`)) {
                                                        try {
                                                            await api.delete(`/batches/${b._id}`);
                                                            fetchBatches();
                                                        } catch (err) {
                                                            alert(err.response?.data?.message || 'Failed to delete batch');
                                                        }
                                                    }
                                                }}
                                                className="btn-danger-outline opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            >
                                                Delete
                                            </button>
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
