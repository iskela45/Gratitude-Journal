import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Today from './pages/Today';
import Journal from './pages/Journal';
import Stats from './pages/Stats';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <header className={styles.header}>
          <span className={styles.logo}>Gratitude Journal</span>
          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : undefined}>
              Today
            </NavLink>
            <NavLink to="/journal" className={({ isActive }) => isActive ? styles.active : undefined}>
              Journal
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => isActive ? styles.active : undefined}>
              Stats
            </NavLink>
          </nav>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
