import type { Entry, EntryPayload, Stats } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const firstFieldError = Object.values(body)[0];
    const message = body.detail
      ?? (Array.isArray(firstFieldError) ? firstFieldError[0] : null)
      ?? `Request failed: ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface EntryFilters {
  year?: number;
  month?: number;
}

export function getEntries(filters?: EntryFilters): Promise<Entry[]> {
  const params = new URLSearchParams();
  if (filters?.year) params.set('year', String(filters.year));
  if (filters?.month) params.set('month', String(filters.month));
  const query = params.size > 0 ? `?${params}` : '';
  return request<Entry[]>(`/api/entries/${query}`);
}

export function getEntry(id: number): Promise<Entry> {
  return request<Entry>(`/api/entries/${id}/`);
}

export function createEntry(data: EntryPayload): Promise<Entry> {
  return request<Entry>('/api/entries/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateEntry(id: number, data: EntryPayload): Promise<Entry> {
  return request<Entry>(`/api/entries/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteEntry(id: number): Promise<void> {
  return request<void>(`/api/entries/${id}/`, { method: 'DELETE' });
}

export function getStats(): Promise<Stats> {
  return request<Stats>('/api/stats/');
}
