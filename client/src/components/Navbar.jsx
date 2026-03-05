import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Clock, Calendar, Heart } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const NAV_ITEMS = [
    { to: '/', label: 'nav.home', icon: Home },
    { to: '/history', label: 'nav.history', icon: Clock },
    { to: '/schedule', label: 'nav.schedule', icon: Calendar },
];

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-lg">
                        💊
                    </div>
                    <span className="font-black text-white text-lg hidden sm:block">
                        AI <span className="gradient-text">Medicine</span>
                    </span>
                </div>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={16} />
                            <span className="hidden sm:block">{t(label)}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Language selector */}
                <LanguageSelector />
            </div>
        </nav>
    );
};

export default Navbar;
