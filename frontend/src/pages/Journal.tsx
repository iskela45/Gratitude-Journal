import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteEntry } from '../api/client';
import { useEntries } from '../hooks/useEntries';
import styles from './Journal.module.css';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

function getMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i).toLocaleDateString(locale, { month: 'long' })
  );
}

function formatEntryDate(dateStr: string, locale: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function Journal() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fi' ? 'fi-FI' : 'en-GB';
  const MONTHS = getMonthNames(locale);

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
      setDeleteError(err instanceof Error ? err.message : t('journal.deleteError'));
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
            <option key={i} value={i + 1}>{name}</option>
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

      {loading && <p className={styles.status}>{t('common.loading')}</p>}
      {error && <p className={styles.error}>{t('common.error', { message: error })}</p>}
      {deleteError && <p className={styles.error}>{deleteError}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className={styles.empty}>{t('journal.empty', { month: MONTHS[month - 1], year })}</p>
      )}

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <time className={styles.date}>{formatEntryDate(entry.date, locale)}</time>
              {confirmId === entry.id ? (
                <div className={styles.confirmActions}>
                  <button className={styles.confirmButton} onClick={() => handleDelete(entry.id)}>{t('common.confirm')}</button>
                  <button className={styles.cancelDeleteButton} onClick={() => setConfirmId(null)}>{t('common.cancel')}</button>
                </div>
              ) : (
                <button className={styles.deleteButton} onClick={() => setConfirmId(entry.id)}>{t('common.delete')}</button>
              )}
            </div>
            <p className={styles.content}>{entry.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
