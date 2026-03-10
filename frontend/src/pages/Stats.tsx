import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useStats } from '../hooks/useStats';
import styles from './Stats.module.css';

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

export default function Stats() {
  const { stats, loading, error } = useStats();

  if (loading) return <p className={styles.status}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!stats) return null;

  if (stats.total === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No entries yet — write your first one on the Today page.</p>
      </div>
    );
  }

  const chartData = stats.entries_per_month.map((row) => ({
    month: formatMonth(row.month),
    entries: row.count,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.current_streak}</span>
          <span className={styles.cardLabel}>Current streak</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.longest_streak}</span>
          <span className={styles.cardLabel}>Longest streak</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.total}</span>
          <span className={styles.cardLabel}>Total entries</span>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.chartTitle}>Entries per month</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #e8e8e4', borderRadius: 6, fontSize: 13 }}
              cursor={{ fill: '#f0f0ec' }}
            />
            <Bar dataKey="entries" fill="#fd836f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
