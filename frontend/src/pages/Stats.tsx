import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useStats } from '../hooks/useStats';
import styles from './Stats.module.css';

function formatMonth(yearMonth: string, locale: string): string {
  const [year, month] = yearMonth.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
  });
}

export default function Stats() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fi' ? 'fi-FI' : 'en-GB';

  const { stats, loading, error } = useStats();

  if (loading) return <p className={styles.status}>{t('common.loading')}</p>;
  if (error) return <p className={styles.error}>{t('common.error', { message: error })}</p>;
  if (!stats) return null;

  if (stats.total === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>{t('stats.empty')}</p>
      </div>
    );
  }

  const chartData = stats.entries_per_month.map((row) => ({
    month: formatMonth(row.month, locale),
    entries: row.count,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.current_streak}</span>
          <span className={styles.cardLabel}>{t('stats.currentStreak')}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.longest_streak}</span>
          <span className={styles.cardLabel}>{t('stats.longestStreak')}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.total}</span>
          <span className={styles.cardLabel}>{t('stats.totalEntries')}</span>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.chartTitle}>{t('stats.entriesPerMonth')}</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #e8e8e4', borderRadius: 6, fontSize: 13 }}
              cursor={{ fill: '#f0f0ec' }}
            />
            <Bar dataKey="entries" name={t('stats.entries')} fill="#fd836f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
