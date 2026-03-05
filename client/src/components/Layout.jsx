import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#05070a]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 relative min-h-screen overflow-x-hidden">
                {/* Background Blobs - Enhanced */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/[0.08] blur-[140px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/[0.06] blur-[120px] rounded-full" />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 lg:py-16">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
