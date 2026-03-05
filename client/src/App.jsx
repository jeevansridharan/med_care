import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import './i18n';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SchedulePage from './pages/SchedulePage';
import InteractionsPage from './pages/InteractionsPage';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#05070a]">
    <div className="spinner" style={{ width: 36, height: 36 }} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="text-6xl">🔍</div>
                <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
                <a href="/" className="btn-primary text-sm">Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </Layout>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
