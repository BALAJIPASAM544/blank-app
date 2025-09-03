import { AnalyticsOverview, EmailDetails, EmailPriority, EmailSentiment } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export async function fetchAnalytics(): Promise<AnalyticsOverview> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchEmails(params: {
  sentiment?: 'All' | EmailSentiment;
  priority?: 'All' | EmailPriority;
  q?: string;
  sort?: 'asc' | 'desc';
}): Promise<EmailDetails[]> {
  const url = new URL(`${API_BASE}/emails`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.length) url.searchParams.set(k, `${v}`);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch emails');
  return res.json();
}

export async function updateReply(id: string, reply: string): Promise<EmailDetails> {
  const res = await fetch(`${API_BASE}/emails/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  });
  if (!res.ok) throw new Error('Failed to update reply');
  return res.json();
}

