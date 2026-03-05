import { useState, useEffect } from 'react';
import { createEntry, updateEntry } from '../api/client';
import { useEntries } from '../hooks/useEntries';
import type { Entry } from '../types';
import styles from './Today.module.css';

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Today() {
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

  // When entry loads, pre-fill the textarea if we enter edit mode
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
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className={styles.status}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  const showForm = !existing || editing;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </h1>
      <p className={styles.prompt}>What are you grateful for today?</p>

      {showForm ? (
        <div className={styles.form}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a few things you're grateful for…"
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
                Cancel
              </button>
            )}
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saving || !content.trim()}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.entry}>
          <p className={styles.entryContent}>{existing.content}</p>
          <button className={styles.editButton} onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
