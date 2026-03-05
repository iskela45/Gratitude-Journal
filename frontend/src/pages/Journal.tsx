import { useState } from 'react';
import { deleteEntry } from '../api/client';
import { useEntries } from '../hooks/useEntries';
import styles from './Journal.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

export default function Journal() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { entries, loading, error, refetch } = useEntries({ year, month });

  async function handleDelete(id: number, date: string) {
    if (!confirm(`Delete entry for ${date}?`)) return;
    try {
      await deleteEntry(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className={styles.select}
        >
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={styles.select}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className={styles.empty}>No entries for {MONTHS[month - 1]} {year}.</p>
      )}

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <time className={styles.date}>
                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                })}
              </time>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(entry.id, entry.date)}
              >
                Delete
              </button>
            </div>
            <p className={styles.content}>{entry.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
