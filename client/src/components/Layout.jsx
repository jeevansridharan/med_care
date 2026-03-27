import Sidebar from './Sidebar';

const SIDEBAR_W = 260; // must match Sidebar.jsx

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#05070a]">
            {/* Sidebar (fixed-positioned, doesn't affect flex flow) */}
            <Sidebar />

            {/*
              Spacer: on lg+ pushes main content right by exactly the sidebar width.
              Since the sidebar is `fixed`, this is the reliable way to create the offset.
            */}
            <div
                className="hidden lg:block flex-shrink-0"
                style={{ width: SIDEBAR_W }}
                aria-hidden="true"
            />

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-x-hidden relative">
                {/* Ambient Background Blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
                    <div
                        className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute top-[45%] right-[20%] w-[400px] h-[400px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }}
                    />
                </div>

                {/* Page Content */}
                <div className="relative z-10 w-full px-5 sm:px-8 xl:px-10 py-8 lg:py-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
