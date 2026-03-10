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

function formatEntryDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function Journal() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { entries, loading, error, refetch } = useEntries({ year, month });

  async function handleDelete(id: number) {
    setDeleteError(null);
    try {
      await deleteEntry(id);
      setConfirmId(null);
      refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete entry');
      setConfirmId(null);
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
      {deleteError && <p className={styles.error}>{deleteError}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className={styles.empty}>No entries for {MONTHS[month - 1]} {year}.</p>
      )}

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <time className={styles.date}>{formatEntryDate(entry.date)}</time>
              {confirmId === entry.id ? (
                <div className={styles.confirmActions}>
                  <button className={styles.confirmButton} onClick={() => handleDelete(entry.id)}>Confirm?</button>
                  <button className={styles.cancelDeleteButton} onClick={() => setConfirmId(null)}>Cancel</button>
                </div>
              ) : (
                <button className={styles.deleteButton} onClick={() => setConfirmId(entry.id)}>Delete</button>
              )}
            </div>
            <p className={styles.content}>{entry.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
