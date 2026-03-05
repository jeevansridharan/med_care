import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Home,
    History,
    Calendar,
    AlertTriangle,
    Settings,
    Menu,
    X,
    Pill
} from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { to: '/', icon: <Home size={20} />, label: 'nav.home' },
        { to: '/history', icon: <History size={20} />, label: 'nav.history' },
        { to: '/schedule', icon: <Calendar size={20} />, label: 'nav.schedule' },
        { to: '/interactions', icon: <AlertTriangle size={20} />, label: 'nav.interactions' },
    ];

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-5 left-5 z-[60] p-2.5 rounded-xl bg-[#111827] border border-white/10 text-white shadow-2xl"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[50] transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 z-[55]
                flex flex-col
                bg-[#0a0c10]/80 backdrop-blur-3xl border-r border-white/5 shadow-2xl
                transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand */}
                <div className="p-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xl shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                        <Pill className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xl leading-none tracking-tight">
                            AI <span className="gradient-text">Medicine</span>
                        </h1>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 opacity-70">Explainer</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-5 py-4 space-y-2.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-300 group
                                ${isActive
                                    ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'}`}>
                                        {item.icon}
                                    </span>
                                    {t(item.label)}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/5 space-y-5 bg-gradient-to-t from-black/20 to-transparent">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('language.select')}</span>
                        <LanguageSelector />
                    </div>

                    <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                        <Settings size={20} className="text-gray-500" />
                        {t('nav.settings', 'Settings')}
                    </button>

                    <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-cyan-500/10 border border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="relative z-10">
                            <p className="text-[11px] text-indigo-300 font-black mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="w-1 h-1 rounded-full bg-indigo-400 pulse" />
                                Pro Engine
                            </p>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Enterprise clinical accuracy enabled.</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
