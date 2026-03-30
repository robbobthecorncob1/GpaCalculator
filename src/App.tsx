import { useEffect, useState } from 'react';
import GpaDashboard from './components/GpaDashboard';

/**
 * The main application component.
 * Acts as the top-level wrapper for the layout and routing. Contains the dark/light mode button.
 */
function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <>
      <button className="themeToggle" onClick={() => setIsDark(!isDark)}>
        {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <GpaDashboard/>
    </>
  )
}

export default App
