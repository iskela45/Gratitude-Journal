import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createEntry, updateEntry } from '../api/client';
import { useEntries } from '../hooks/useEntries';
import type { Entry } from '../types';
import styles from './Today.module.css';

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatHeadingDate(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Today() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fi' ? 'fi-FI' : 'en-GB';

  const today = toISODate(new Date());
  const now = new Date();

  const { entries, loading, error, refetch } = useEntries({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const existing: Entry | undefined = entries.find((e) => e.date === today);

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // When entry loads, pre-fill the text area if entering edit mode
  useEffect(() => {
    if (existing) setContent(existing.content);
  }, [existing?.id]);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (existing) {
        await updateEntry(existing.id, { date: today, content });
      } else {
        await createEntry({ date: today, content });
      }
      setEditing(false);
      refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('today.saveError'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className={styles.status}>{t('common.loading')}</p>;
  if (error) return <p className={styles.error}>{t('common.error', { message: error })}</p>;

  const showForm = !existing || editing;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{formatHeadingDate(new Date(), locale)}</h1>
      <p className={styles.prompt}>{t('today.prompt')}</p>

      {showForm ? (
        <div className={styles.form}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('today.placeholder')}
            rows={6}
            autoFocus
          />
          {saveError && <p className={styles.error}>{saveError}</p>}
          <div className={styles.actions}>
            {existing && (
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setEditing(false);
                  setContent(existing.content);
                }}
              >
                {t('common.cancel')}
              </button>
            )}
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saving || !content.trim()}
            >
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.entry}>
          <p className={styles.entryContent}>{existing.content}</p>
          <button className={styles.editButton} onClick={() => setEditing(true)}>
            {t('common.edit')}
          </button>
        </div>
      )}
    </div>
  );
}
