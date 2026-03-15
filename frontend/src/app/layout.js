'use client';
import './globals.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/batches', label: 'Batches', icon: '🏭' },
    { href: '/inspections', label: 'Inspections', icon: '🔍' },
    { href: '/defects', label: 'Defects', icon: '⚠️' },
    { href: '/alerts', label: 'Alerts', icon: '🔔' },
];

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) setUser(JSON.parse(stored));
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isLoginPage = pathname === '/login';

    return (
        <html lang="en">
            <head>
                <title>GlassQC — Quality Control System</title>
                <meta name="description" content="Glass Manufacturing Quality Control System for monitoring and managing product quality." />
            </head>
            <body className="min-h-screen">
                {isLoginPage ? (
                    children
                ) : (
                    <div className="flex min-h-screen bg-[#020617]">
                        {/* Sidebar */}
                        <aside className="w-68 flex-shrink-0 border-r border-white/5 bg-slate-950/40 backdrop-blur-xl p-8 flex flex-col">
                            <div className="mb-12">
                                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                                    GlassQC
                                </h1>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500/80 font-bold mt-2">Quality Assurance</p>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={`sidebar-link group ${pathname === item.href ? 'active' : ''}`}
                                    >
                                        <span className={`text-xl transition-transform duration-300 group-hover:scale-125 ${pathname === item.href ? 'scale-110' : ''}`}>{item.icon}</span>
                                        <span className="font-semibold tracking-wide">{item.label}</span>
                                    </a>
                                ))}
                            </nav>
                            {user && (
                                <div className="mt-auto pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">{user.name}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{user.role?.replace('_', ' ')}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="mt-6 w-full py-2 text-xs font-bold text-red-400/80 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-lg transition-all duration-300 cursor-pointer bg-red-500/5"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </aside>
                        {/* Main Content */}
                        <main className="flex-1 overflow-auto bg-[radial-gradient(rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
                            <div className="max-w-7xl mx-auto p-10 animate-slide-in">
                                {children}
                            </div>
                        </main>
                    </div>
                )}
            </body>
        </html>
    );
}
