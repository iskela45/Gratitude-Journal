import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Today from './pages/Today';
import Journal from './pages/Journal';
import Stats from './pages/Stats';
import styles from './App.module.css';

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.logo}>{t('logo')}</span>
            <div className={styles.headerRight}>
              <nav className={styles.nav}>
                <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : undefined}>
                  {t('nav.today')}
                </NavLink>
                <NavLink to="/journal" className={({ isActive }) => isActive ? styles.active : undefined}>
                  {t('nav.journal')}
                </NavLink>
                <NavLink to="/stats" className={({ isActive }) => isActive ? styles.active : undefined}>
                  {t('nav.stats')}
                </NavLink>
              </nav>
              <button
                className={styles.langToggle}
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fi' : 'en')}
              >
                {i18n.language === 'en' ? 'FI' : 'EN'}
              </button>
            </div>
          </div>
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
