'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const COLORS = ['#338bff', '#2dd4a8', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch {
                console.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-slate-400">Unable to load dashboard data. Check that you have the correct permissions.</p>
            </div>
        );
    }

    const passFailData = [
        { name: 'Pass', value: stats.passCount },
        { name: 'Fail', value: stats.failCount },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">Production overview and quality metrics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-card stat-card p-6 glow-blue">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Batches</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalBatches}</p>
                </div>
                <div className="glass-card stat-card p-6 glow-green">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Production Efficiency</p>
                    <p className="text-3xl font-bold text-glass-400 mt-2">{stats.productionEfficiency}%</p>
                </div>
                <div className="glass-card stat-card p-6 glow-amber">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Defect Rate</p>
                    <p className="text-3xl font-bold text-amber-400 mt-2">{stats.defectRate}%</p>
                </div>
                <div className="glass-card stat-card p-6 glow-red">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Alerts</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">{stats.unresolvedAlerts}</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Batches per Day */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Production Batches (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.batchesPerDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }}
                            />
                            <Bar dataKey="count" fill="#338bff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pass vs Fail Pie */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Pass vs Fail Ratio</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={passFailData}
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Defects by Type */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Defects by Type</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.defectsByType} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis dataKey="_id" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={110} />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }}
                            />
                            <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Inspector Performance */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">Inspector Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Inspector</th>
                                    <th>Total</th>
                                    <th>Pass Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.inspectorPerformance?.map((ip, i) => (
                                    <tr key={i}>
                                        <td className="font-medium text-white">{ip._id}</td>
                                        <td>{ip.totalInspections}</td>
                                        <td>
                                            <span className={`badge ${ip.passRate >= 80 ? 'badge-pass' : 'badge-fail'}`}>
                                                {ip.passRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.inspectorPerformance || stats.inspectorPerformance.length === 0) && (
                                    <tr><td colSpan={3} className="text-center text-slate-500 py-8">No inspection data yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">🔔 Recent Alerts</h3>
                {stats.recentAlerts?.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentAlerts.map((alert) => (
                            <div
                                key={alert._id}
                                className={`flex items-start gap-3 p-4 rounded-xl border ${alert.isResolved
                                        ? 'bg-white/3 border-white/5'
                                        : 'bg-red-500/5 border-red-500/15 pulse-alert'
                                    }`}
                            >
                                <span className="text-lg">{alert.isResolved ? '✅' : '🚨'}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200">{alert.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Batch: {alert.batch?.batchId || 'N/A'} • {new Date(alert.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`badge ${alert.isResolved ? 'badge-resolved' : 'badge-fail'}`}>
                                    {alert.isResolved ? 'Resolved' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm text-center py-8">No recent alerts</p>
                )}
            </div>
        </div>
    );
}
