import React from 'react';

// Simple test component first
function App() {
  console.log('🔍 App.tsx is loading...');
  console.log('🔍 Environment variables:', {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
  });

  try {
    // Try to import the main component
    const AIDashboard = React.lazy(() => import('./components/ai-dashboard-complete'));

    return (
      <div style={{ padding: '20px', color: 'white', backgroundColor: '#111827', minHeight: '100vh' }}>
        <h1>🔍 Debug Mode</h1>
        <p>If you see this, React is working!</p>
        <p>Environment check:</p>
        <ul>
          <li>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || '❌ Missing'}</li>
          <li>SUPABASE_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}</li>
        </ul>
        
        <React.Suspense fallback={<div>Loading dashboard...</div>}>
          <AIDashboard />
        </React.Suspense>
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading dashboard:', error);
    return (
      <div style={{ padding: '20px', color: 'red', backgroundColor: '#111827', minHeight: '100vh' }}>
        <h1>❌ Error Loading Dashboard</h1>
        <p>Check console for details</p>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}

export default App;