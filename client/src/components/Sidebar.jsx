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
    Pill,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

const SIDEBAR_WIDTH = 260;

const Sidebar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { to: '/', icon: Home, label: 'nav.home', color: 'indigo' },
        { to: '/history', icon: History, label: 'nav.history', color: 'cyan' },
        { to: '/schedule', icon: Calendar, label: 'nav.schedule', color: 'violet' },
        { to: '/interactions', icon: AlertTriangle, label: 'nav.interactions', color: 'amber' },
    ];

    const colorMap = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-xl bg-[#111827]/90 border border-white/10 text-white shadow-2xl backdrop-blur-xl"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[50] transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside
                style={{ width: SIDEBAR_WIDTH }}
                className={`
                    fixed top-0 left-0 h-full z-[55]
                    flex flex-col
                    bg-[#080a10]/95 backdrop-blur-2xl
                    border-r border-white/[0.06]
                    shadow-[4px_0_24px_rgba(0,0,0,0.4)]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Brand */}
                <div className="px-6 py-7 flex items-center gap-3.5 border-b border-white/[0.05]">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <Pill className="text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-[17px] leading-none tracking-tight">
                            AI <span className="gradient-text">Medicine</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.18em] mt-1">
                            Explainer
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-3 mb-3">Navigation</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold
                                    transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0
                                            transition-all duration-200
                                            ${isActive ? colorMap[item.color] : 'text-gray-500 bg-white/[0.03] border-white/[0.06] group-hover:' + colorMap[item.color]}
                                        `}>
                                            <Icon size={16} />
                                        </span>
                                        <span>{t(item.label)}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Controls */}
                <div className="px-4 pb-6 pt-4 border-t border-white/[0.05] space-y-3">
                    {/* Language */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                            {t('language.select')}
                        </span>
                        <LanguageSelector />
                    </div>

                    {/* Settings */}
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
                            <Settings size={15} className="text-gray-500" />
                        </span>
                        {t('nav.settings', 'Settings')}
                    </button>

                    {/* Pro Badge */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/8 via-transparent to-cyan-500/8 border border-indigo-500/15 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent" />
                        <div className="relative z-10 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <Zap size={13} className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[11px] text-indigo-300 font-bold mb-0.5 uppercase tracking-wider">Pro Engine</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed">Enterprise clinical accuracy enabled.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
