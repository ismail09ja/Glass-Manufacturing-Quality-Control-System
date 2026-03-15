'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const { data } = await api.get('/alerts');
            setAlerts(data || []);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchAlerts(); }, []);

    const handleResolve = async (id) => {
        try {
            await api.put(`/alerts/${id}/resolve`);
            fetchAlerts();
        } catch { }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Alerts</h1>
                <p className="text-slate-400 text-sm mt-1">Quality failure notifications</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading alerts...</div>
            ) : alerts.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <span className="text-4xl mb-4 block">✅</span>
                    <p className="text-slate-400">No alerts at this time. All systems running smoothly.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`glass-card p-5 flex items-start gap-4 ${!alert.isResolved ? 'pulse-alert border-red-500/20' : ''}`}
                        >
                            <span className="text-2xl">{alert.isResolved ? '✅' : '🚨'}</span>
                            <div className="flex-1">
                                <p className="text-sm text-slate-200 font-medium">{alert.message}</p>
                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                    <span>Batch: {alert.batch?.batchId || 'N/A'}</span>
                                    <span>Line: {alert.batch?.productionLine || 'N/A'}</span>
                                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`badge ${alert.isResolved ? 'badge-resolved' : 'badge-fail'}`}>
                                    {alert.isResolved ? 'Resolved' : 'Active'}
                                </span>
                                {!alert.isResolved && (
                                    <button onClick={() => handleResolve(alert._id)} className="btn-success text-xs cursor-pointer">
                                        Resolve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
