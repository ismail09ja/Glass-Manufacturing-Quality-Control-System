'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'quality_inspector' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const payload = isRegister ? form : { email: form.email, password: form.password };
            const { data } = await api.post(endpoint, payload);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-glass-600/10 rounded-full blur-3xl" />
            </div>

            <div className="glass-card p-10 w-full max-w-md relative animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-glass-500 mb-4">
                        <span className="text-3xl">🔬</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">GlassQC</h1>
                    <p className="text-slate-400 text-sm mt-1">Glass Manufacturing Quality Control</p>
                </div>

                {/* Toggle */}
                <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                    <button
                        onClick={() => setIsRegister(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${!isRegister ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsRegister(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${isRegister ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                className="glass-input"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                        <input
                            type="email"
                            className="glass-input"
                            placeholder="you@factory.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                        <input
                            type="password"
                            className="glass-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>
                    {isRegister && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                            <select
                                className="glass-input"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="admin">Admin</option>
                                <option value="quality_inspector">Quality Inspector</option>
                                <option value="production_manager">Production Manager</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
